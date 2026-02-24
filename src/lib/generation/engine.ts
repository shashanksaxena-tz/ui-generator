import { generateText, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type {
  GenerationRequest,
  GenerationResult,
  ReactInterfaceSchema,
  ThemeConfig,
} from "@/types";
import { buildSystemPrompt, buildRefinementPrompt } from "./prompts";
import { validateSchema, extractComponentNames, applyDefaults } from "./schema";
import { schemaCache } from "./cache";
import { generateTheme, defaultDarkTheme } from "@/lib/theme/engine";
import { logGeneration } from "@/lib/logging";
import { selectRelevantComponents, getComponentsWithFallback } from "./component-selection";
import { getAllComponentNames } from "@/lib/registry/components";
import { enrichSchema } from "@/lib/assets/enricher";

/**
 * Get the AI provider based on environment configuration.
 * Default: Google Gemini (gemini-2.0-flash)
 */
function getProvider() {
  const providerName = process.env.AI_PROVIDER ?? "google";
  const model = process.env.AI_MODEL;

  switch (providerName) {
    case "anthropic": {
      const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      return anthropic(model || "claude-sonnet-4-20250514");
    }
    case "openai": {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return openai(model || "gpt-4o");
    }
    case "google":
    default: {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return google(model || "gemini-2.0-flash");
    }
  }
}

/**
 * Detect which AI provider has a valid API key configured.
 */
function getAvailableProvider(): string | null {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "google";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

/**
 * Get the AI provider, auto-detecting if configured provider has no key.
 */
function getProviderWithFallback() {
  const preferred = process.env.AI_PROVIDER ?? "google";
  const hasKey: Record<string, boolean> = {
    google: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
  };

  if (hasKey[preferred]) {
    return getProvider();
  }

  // Auto-fallback to any available provider
  const available = getAvailableProvider();
  if (available) {
    const origProvider = process.env.AI_PROVIDER;
    process.env.AI_PROVIDER = available;
    const provider = getProvider();
    process.env.AI_PROVIDER = origProvider;
    return provider;
  }

  return null;
}

/**
 * Parse the LLM response into a ReactInterfaceSchema.
 * Handles common response artifacts (markdown fences, extra text).
 */
function parseSchemaResponse(text: string): ReactInterfaceSchema {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  // Find the JSON object boundaries
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in LLM response");
  }
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(cleaned);

  // Ensure basic structure
  if (!parsed.root) {
    throw new Error("Schema missing root node");
  }
  if (!parsed.version) {
    parsed.version = "1.0";
  }

  return parsed as ReactInterfaceSchema;
}

/**
 * Main generation engine. Takes a user prompt and generates a React Interface Schema.
 */
export async function generateUI(
  request: GenerationRequest
): Promise<GenerationResult> {
  const startTime = Date.now();
  const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const loggingEnabled = process.env.ENABLE_GENERATION_LOGGING === 'true';

  // Check cache first — always re-enrich cached schemas so asset URLs stay fresh
  const cached = schemaCache.get(request.prompt);
  if (cached) {
    const enrichedCached = await enrichSchema(cached);
    return {
      schema: enrichedCached,
      theme: request.theme ? generateTheme({
        brandColor: request.theme.colors?.primary?.[500],
        mode: request.theme.mode,
      }) : undefined,
      metadata: {
        tokensUsed: 0,
        model: "cache",
        generationTimeMs: Date.now() - startTime,
        componentsUsed: extractComponentNames(enrichedCached),
        cachedLayout: true,
      },
    };
  }


  // Component selection using LLM
  const selectionStartTime = Date.now();
  const selectionResult = await selectRelevantComponents(request.prompt);
  const selectionTime = Date.now() - selectionStartTime;

  console.log(`[Generation] Component selection took ${selectionTime}ms`);
  console.log(`[Generation] Selected ${selectionResult.components.length} components`);
  if (selectionResult.explicitlyRequested.length > 0) {
    console.log(`[Generation] User explicitly requested: ${selectionResult.explicitlyRequested.join(', ')}`);
  }

  // Get all components as fallback
  const allComponents = getAllComponentNames();
  const componentsToUse = getComponentsWithFallback(selectionResult.components, allComponents);

  // Update constraints to use filtered components
  const updatedConstraints = {
    ...request.constraints,
    allowedComponents: componentsToUse,
  };

  const systemPrompt = buildSystemPrompt(
    updatedConstraints,
    request.theme as ThemeConfig,
    request.styleHint,
    selectionResult.explicitlyRequested
  );

  // Build user message — reinforce explicit component requests in the user message too
  let userMessage = request.prompt;
  if (selectionResult.explicitlyRequested.length > 0) {
    userMessage += `\n\n[REQUIRED COMPONENTS: You MUST use these exact component types in your output: ${selectionResult.explicitlyRequested.join(', ')}. Do not substitute with similar components.]`;
  }
  if (request.context?.previousSchema) {
    userMessage = buildRefinementPrompt(
      JSON.stringify(request.context.previousSchema, null, 2),
      request.prompt,
      selectionResult.explicitlyRequested
    );
  }

  const model = getProviderWithFallback();
  if (!model) {
    throw new Error("No AI provider configured. Set GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY.");
  }

  // Point A: Log before LLM call
  if (loggingEnabled) {
    const providerName = process.env.AI_PROVIDER ?? "google";
    const modelName = process.env.AI_MODEL ?? (providerName === "google" ? "gemini-2.0-flash" : "default");
    await logGeneration(generationId, 'llm-input', {
      prompt: request.prompt,
      systemPromptPreview: systemPrompt.substring(0, 500) + '...',
      systemPromptLength: systemPrompt.length,
      provider: providerName,
      model: modelName,
      hasContext: !!request.context?.previousSchema,
    });
  }

  const result = await generateText({
    model,
    system: systemPrompt,
    prompt: userMessage,
    maxTokens: 16384,
    temperature: 0.7,
  });

  // Point B: Log after LLM response
  if (loggingEnabled) {
    await logGeneration(generationId, 'llm-output', {
      rawResponsePreview: result.text.substring(0, 2000),
      fullLength: result.text.length,
      tokensUsed: result.usage?.totalTokens ?? 0,
    });
  }

  // Parse the schema from LLM response
  let schema: ReactInterfaceSchema;
  try {
    schema = parseSchemaResponse(result.text);
  } catch (parseError) {
    throw new Error(
      `Failed to parse generated schema: ${parseError instanceof Error ? parseError.message : "Unknown error"}`
    );
  }

  // Point C: Log after schema parsing
  if (loggingEnabled) {
    await logGeneration(generationId, 'schema-parsed', {
      schema: schema,
      componentsUsed: extractComponentNames(schema),
      hasRoot: !!schema.root,
      version: schema.version,
    });
  }

  // Validate and apply defaults
  const validationErrors = validateSchema(schema);

  // Point D: Log validation warnings
  if (loggingEnabled && validationErrors.length > 0) {
    await logGeneration(generationId, 'validation-warnings', {
      warnings: validationErrors,
      warningCount: validationErrors.length,
    });
  }

  if (validationErrors.length > 0) {
    console.warn("Schema validation warnings:", validationErrors);
  }

  schema = applyDefaults(schema);

  // Enrich schema with contextual assets (semantic photos + SVG illustrations)
  schema = await enrichSchema(schema);

  // Add metadata
  schema.meta = {
    ...schema.meta,
    generatedAt: new Date().toISOString(),
    prompt: request.prompt,
  };

  // Cache the result
  schemaCache.set(request.prompt, schema);

  // Generate theme if requested
  let theme: ThemeConfig | undefined;
  if (request.theme) {
    theme = generateTheme({
      brandColor: request.theme.colors?.primary?.[500],
      mode: request.theme.mode,
    });
  }

  const componentsUsed = extractComponentNames(schema);

  return {
    schema,
    theme,
    metadata: {
      tokensUsed: result.usage?.totalTokens ?? 0,
      model: process.env.AI_MODEL ?? "gemini-2.0-flash",
      generationTimeMs: Date.now() - startTime,
      componentsUsed,
      cachedLayout: false,
      // Component selection metrics
      componentSelectionTime: selectionTime,
      totalComponents: allComponents.length,
      selectedComponents: componentsToUse.length,
    },
  };
}

/**
 * Generate UI with streaming support.
 * Returns an async generator that yields partial schemas as they're built.
 */
export async function* generateUIStream(
  request: GenerationRequest
): AsyncGenerator<{ type: "partial" | "complete" | "error"; data: unknown }> {
  try {
    // Yield initial status
    yield { type: "partial", data: { status: "generating", prompt: request.prompt } };

    const result = await generateUI(request);

    // Yield complete result
    yield {
      type: "complete",
      data: result,
    };
  } catch (error) {
    yield {
      type: "error",
      data: {
        message: error instanceof Error ? error.message : "Generation failed",
      },
    };
  }
}

/**
 * Generate a fallback/demo schema without AI for testing.
 */
export function generateDemoSchema(prompt: string): ReactInterfaceSchema {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("analytics")) {
    return getDashboardDemo();
  }
  if (lowerPrompt.includes("landing") || lowerPrompt.includes("marketing")) {
    return getLandingPageDemo();
  }
  if (lowerPrompt.includes("kanban") || lowerPrompt.includes("board") || lowerPrompt.includes("project")) {
    return getKanbanDemo();
  }
  if (lowerPrompt.includes("form") || lowerPrompt.includes("survey") || lowerPrompt.includes("onboarding")) {
    return getFormDemo();
  }
  if (lowerPrompt.includes("table") || lowerPrompt.includes("users") || lowerPrompt.includes("admin")) {
    return getDataTableDemo();
  }
  if (lowerPrompt.includes("ecommerce") || lowerPrompt.includes("product") || lowerPrompt.includes("shop")) {
    return getEcommerceDemo();
  }
  if (lowerPrompt.includes("blog") || lowerPrompt.includes("article") || lowerPrompt.includes("content")) {
    return getBlogDemo();
  }
  if (lowerPrompt.includes("settings") || lowerPrompt.includes("profile") || lowerPrompt.includes("account")) {
    return getSettingsDemo();
  }
  if (lowerPrompt.includes("faq") || lowerPrompt.includes("help") || lowerPrompt.includes("support")) {
    return getFAQDemo();
  }
  if (lowerPrompt.includes("chat") || lowerPrompt.includes("message") || lowerPrompt.includes("conversation")) {
    return getChatDemo();
  }
  if (lowerPrompt.includes("changelog") || lowerPrompt.includes("release") || lowerPrompt.includes("update")) {
    return getChangelogDemo();
  }
  if (lowerPrompt.includes("file") || lowerPrompt.includes("explorer") || lowerPrompt.includes("directory")) {
    return getFileExplorerDemo();
  }

  // Default: dashboard
  return getDashboardDemo();
}

function getDashboardDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "xl" },
      children: [
        {
          type: "Section",
          props: { title: "Sales Dashboard", description: "Real-time performance metrics" },
          children: [
            {
              type: "Grid",
              props: { cols: 4, gap: 4 },
              children: [
                {
                  type: "KPICard",
                  props: {
                    title: "Total Revenue",
                    value: "$48,352",
                    change: "+12.5%",
                    changeType: "positive",
                    icon: "DollarSign",
                  },
                },
                {
                  type: "KPICard",
                  props: {
                    title: "Active Users",
                    value: "2,847",
                    change: "+8.2%",
                    changeType: "positive",
                    icon: "Users",
                  },
                },
                {
                  type: "KPICard",
                  props: {
                    title: "Conversion Rate",
                    value: "3.24%",
                    change: "-0.4%",
                    changeType: "negative",
                    icon: "TrendingUp",
                  },
                },
                {
                  type: "KPICard",
                  props: {
                    title: "Avg Order Value",
                    value: "$67.40",
                    change: "+2.1%",
                    changeType: "positive",
                    icon: "ShoppingCart",
                  },
                },
              ],
            },
            {
              type: "Grid",
              props: { cols: 2, gap: 4 },
              children: [
                {
                  type: "Card",
                  props: { title: "Revenue Trend" },
                  children: [
                    {
                      type: "AreaChart",
                      props: {
                        data: [
                          { month: "Jan", revenue: 18500, profit: 4200 },
                          { month: "Feb", revenue: 22300, profit: 5100 },
                          { month: "Mar", revenue: 19800, profit: 4800 },
                          { month: "Apr", revenue: 27600, profit: 6300 },
                          { month: "May", revenue: 32100, profit: 7200 },
                          { month: "Jun", revenue: 35800, profit: 8100 },
                          { month: "Jul", revenue: 31200, profit: 7500 },
                          { month: "Aug", revenue: 38400, profit: 9200 },
                          { month: "Sep", revenue: 42100, profit: 10100 },
                          { month: "Oct", revenue: 39800, profit: 9600 },
                          { month: "Nov", revenue: 44500, profit: 10800 },
                          { month: "Dec", revenue: 48352, profit: 11600 },
                        ],
                        xKey: "month",
                        yKeys: [
                          { key: "revenue", color: "#4e8cff", label: "Revenue" },
                          { key: "profit", color: "#34d399", label: "Profit" },
                        ],
                        height: 300,
                        stacked: false,
                        gradient: true,
                      },
                    },
                  ],
                },
                {
                  type: "Card",
                  props: { title: "Sales by Region" },
                  children: [
                    {
                      type: "BarChart",
                      props: {
                        data: [
                          { region: "North America", sales: 18200, target: 20000 },
                          { region: "Europe", sales: 14500, target: 15000 },
                          { region: "Asia Pacific", sales: 9800, target: 12000 },
                          { region: "Latin America", sales: 3600, target: 5000 },
                          { region: "Middle East", sales: 2252, target: 3000 },
                        ],
                        xKey: "region",
                        yKeys: [
                          { key: "sales", color: "#4e8cff", label: "Sales" },
                          { key: "target", color: "#3d3d45", label: "Target" },
                        ],
                        height: 300,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "Card",
              props: { title: "Recent Transactions" },
              children: [
                {
                  type: "DataTable",
                  props: {
                    columns: [
                      { key: "customer", header: "Customer", type: "text" },
                      { key: "email", header: "Email", type: "text" },
                      { key: "amount", header: "Amount", type: "number", sortable: true },
                      { key: "status", header: "Status", type: "badge" },
                      { key: "date", header: "Date", type: "text", sortable: true },
                    ],
                    data: [
                      { customer: "Sarah Chen", email: "sarah@example.com", amount: 245.00, status: "completed", date: "2026-02-17" },
                      { customer: "Marcus Johnson", email: "marcus@example.com", amount: 189.50, status: "completed", date: "2026-02-17" },
                      { customer: "Elena Rodriguez", email: "elena@example.com", amount: 520.00, status: "pending", date: "2026-02-16" },
                      { customer: "James Wilson", email: "james@example.com", amount: 75.25, status: "completed", date: "2026-02-16" },
                      { customer: "Aisha Patel", email: "aisha@example.com", amount: 312.80, status: "refunded", date: "2026-02-15" },
                    ],
                    hoverable: true,
                    pagination: true,
                    pageSize: 10,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    meta: {
      title: "Sales Dashboard",
      description: "Real-time sales analytics dashboard with KPIs, charts, and transaction history",
    },
  };
}

function getLandingPageDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "xl" },
      children: [
        {
          type: "Hero",
          props: {
            headline: "Build Faster with AI-Powered Components",
            subheadline: "Ship beautiful, production-ready UIs in minutes. Powered by intelligent component composition and real-time generation.",
            ctaText: "Start Building Free",
            ctaHref: "#pricing",
            secondaryCtaText: "View Documentation",
            alignment: "center",
          },
        },
        {
          type: "Section",
          props: { title: "Why Teams Choose Us", description: "Everything you need to build modern applications" },
          children: [
            {
              type: "FeatureGrid",
              props: {
                columns: 3,
                features: [
                  { icon: "Zap", title: "Lightning Fast", description: "Generate complete UIs from natural language prompts. No more boilerplate." },
                  { icon: "Palette", title: "Theme Intelligence", description: "One brand color generates a full design system. Dark mode included." },
                  { icon: "Puzzle", title: "Component Ecosystem", description: "25+ MCP servers with shadcn/ui, Chakra, Magic UI, and more." },
                  { icon: "Layers", title: "Smart Layouts", description: "AI-composed layouts with responsive grids, flex, and adaptive spacing." },
                  { icon: "RefreshCw", title: "Iterative Refinement", description: "Refine generated UIs conversationally. Just say what to change." },
                  { icon: "Shield", title: "Enterprise Ready", description: "SOC 2 + HIPAA compliant. Self-hostable. Your data stays yours." },
                ],
              },
            },
          ],
        },
        {
          type: "Section",
          props: { title: "Trusted by Industry Leaders" },
          children: [
            {
              type: "Testimonial",
              props: {
                variant: "cards",
                testimonials: [
                  { quote: "We reduced our frontend development time by 60%. The AI understands our design system perfectly.", author: "Lisa Chang", role: "VP of Engineering, Dataflow", rating: 5 },
                  { quote: "The component quality is production-ready. We ship generated UIs directly to customers.", author: "Marcus Webb", role: "CTO, Startline", rating: 5 },
                  { quote: "Finally a tool that generates real React components, not just mockups. Game changer for our team.", author: "Priya Sharma", role: "Lead Designer, Nexus Labs", rating: 5 },
                ],
              },
            },
          ],
        },
        {
          type: "Section",
          props: { title: "Simple, Transparent Pricing" },
          children: [
            {
              type: "PricingTable",
              props: {
                plans: [
                  {
                    name: "Starter",
                    price: "$0",
                    period: "/month",
                    description: "Perfect for side projects",
                    features: ["100 generations/month", "Core components", "Community support", "Light/dark themes"],
                    ctaText: "Get Started",
                    highlighted: false,
                  },
                  {
                    name: "Pro",
                    price: "$49",
                    period: "/month",
                    description: "For growing teams",
                    features: ["Unlimited generations", "All component libraries", "Priority support", "Custom themes", "MCP integrations", "Team collaboration"],
                    ctaText: "Start Free Trial",
                    highlighted: true,
                  },
                  {
                    name: "Enterprise",
                    price: "Custom",
                    period: "",
                    description: "For organizations",
                    features: ["Everything in Pro", "Self-hosted deployment", "SSO & RBAC", "Custom MCP servers", "SLA guarantee", "Dedicated support"],
                    ctaText: "Contact Sales",
                    highlighted: false,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    meta: {
      title: "SaaS Landing Page",
      description: "Complete landing page with hero, features, testimonials, and pricing",
    },
  };
}

function getKanbanDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "xl" },
      children: [
        {
          type: "Section",
          props: { title: "Project Board", description: "Sprint 24 — Feb 10-24, 2026" },
          children: [
            {
              type: "KanbanBoard",
              props: {
                columns: [
                  {
                    id: "backlog",
                    title: "Backlog",
                    color: "#8a8a95",
                    cards: [
                      { id: "t1", title: "Implement SSO integration", description: "Add SAML/OIDC support for enterprise customers", priority: "medium", assignee: "Alex", tags: ["backend", "auth"] },
                      { id: "t2", title: "Write API documentation", description: "Document all public API endpoints with examples", priority: "low", assignee: "Sarah", tags: ["docs"] },
                    ],
                  },
                  {
                    id: "in-progress",
                    title: "In Progress",
                    color: "#4e8cff",
                    cards: [
                      { id: "t3", title: "Real-time collaboration", description: "WebSocket-based multi-user editing", priority: "high", assignee: "Marcus", tags: ["frontend", "ws"], dueDate: "2026-02-20" },
                      { id: "t4", title: "Theme editor redesign", description: "New visual theme editor with live preview", priority: "medium", assignee: "Priya", tags: ["design", "frontend"], dueDate: "2026-02-22" },
                    ],
                  },
                  {
                    id: "review",
                    title: "In Review",
                    color: "#a78bfa",
                    cards: [
                      { id: "t5", title: "Performance optimization", description: "Reduce bundle size by 30% and improve LCP", priority: "high", assignee: "James", tags: ["performance"], dueDate: "2026-02-18" },
                    ],
                  },
                  {
                    id: "done",
                    title: "Done",
                    color: "#34d399",
                    cards: [
                      { id: "t6", title: "MCP server registry", description: "Central registry for discovering MCP servers", priority: "high", assignee: "Elena", tags: ["backend", "mcp"] },
                      { id: "t7", title: "Dark mode support", description: "System-wide dark mode with CSS variables", priority: "medium", assignee: "Priya", tags: ["design", "css"] },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    meta: {
      title: "Project Kanban Board",
      description: "Sprint planning kanban board with task cards, priorities, and assignees",
    },
  };
}

function getFormDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "md" },
      children: [
        {
          type: "Section",
          props: { title: "Create Account", description: "Set up your workspace in a few steps" },
          children: [
            {
              type: "Form",
              props: {
                title: "Personal Information",
                fields: [
                  { name: "firstName", label: "First Name", type: "text", placeholder: "Enter your first name", required: true },
                  { name: "lastName", label: "Last Name", type: "text", placeholder: "Enter your last name", required: true },
                  { name: "email", label: "Email Address", type: "email", placeholder: "you@company.com", required: true },
                  { name: "password", label: "Password", type: "password", placeholder: "Create a strong password", required: true },
                  { name: "company", label: "Company", type: "text", placeholder: "Your company name" },
                  { name: "role", label: "Role", type: "select", options: [
                    { value: "developer", label: "Developer" },
                    { value: "designer", label: "Designer" },
                    { value: "manager", label: "Product Manager" },
                    { value: "other", label: "Other" },
                  ]},
                  { name: "bio", label: "Bio", type: "textarea", placeholder: "Tell us about yourself" },
                  { name: "terms", label: "I agree to the Terms of Service and Privacy Policy", type: "checkbox", required: true },
                ],
                submitText: "Create Account",
                layout: "two-column",
              },
            },
          ],
        },
      ],
    },
    meta: {
      title: "Onboarding Form",
      description: "User registration form with validation and multi-field layout",
    },
  };
}

function getDataTableDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "xl" },
      children: [
        {
          type: "Section",
          props: { title: "User Management", description: "Manage team members and permissions" },
          children: [
            {
              type: "Flex",
              props: { direction: "row", justify: "between", align: "center", gap: 4 },
              children: [
                { type: "Input", props: { placeholder: "Search users...", type: "search" } },
                { type: "Button", props: { text: "Add User", variant: "default", icon: "Plus" } },
              ],
            },
            {
              type: "DataTable",
              props: {
                columns: [
                  { key: "name", header: "Name", type: "text", sortable: true },
                  { key: "email", header: "Email", type: "text" },
                  { key: "role", header: "Role", type: "badge" },
                  { key: "status", header: "Status", type: "badge" },
                  { key: "lastActive", header: "Last Active", type: "text", sortable: true },
                ],
                data: [
                  { name: "Sarah Chen", email: "sarah@company.com", role: "Admin", status: "active", lastActive: "2 minutes ago" },
                  { name: "Marcus Johnson", email: "marcus@company.com", role: "Developer", status: "active", lastActive: "15 minutes ago" },
                  { name: "Elena Rodriguez", email: "elena@company.com", role: "Designer", status: "active", lastActive: "1 hour ago" },
                  { name: "James Wilson", email: "james@company.com", role: "Developer", status: "inactive", lastActive: "3 days ago" },
                  { name: "Aisha Patel", email: "aisha@company.com", role: "Manager", status: "active", lastActive: "30 minutes ago" },
                  { name: "Tom Brooks", email: "tom@company.com", role: "Developer", status: "active", lastActive: "5 minutes ago" },
                  { name: "Yuki Tanaka", email: "yuki@company.com", role: "Designer", status: "away", lastActive: "2 hours ago" },
                  { name: "Robert Kim", email: "robert@company.com", role: "Admin", status: "active", lastActive: "Just now" },
                ],
                hoverable: true,
                pagination: true,
                pageSize: 5,
                striped: true,
              },
            },
          ],
        },
      ],
    },
    meta: {
      title: "User Management",
      description: "Admin panel with user data table, search, and actions",
    },
  };
}

function getEcommerceDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "xl" },
      children: [
        {
          type: "Navbar",
          props: {
            brand: "TechStore",
            links: [
              { label: "All Products", href: "#", active: true },
              { label: "Laptops", href: "#" },
              { label: "Phones", href: "#" },
              { label: "Accessories", href: "#" },
            ],
            showSearch: true,
          },
        },
        {
          type: "Section",
          props: { title: "Featured Products", description: "Latest arrivals and best sellers" },
          children: [
            {
              type: "Grid",
              props: { cols: 3, gap: 4 },
              children: [
                {
                  type: "Card",
                  props: { title: "MacBook Pro 16\"", description: "M4 Max, 48GB RAM, 1TB SSD" },
                  children: [
                    {
                      type: "Flex",
                      props: { direction: "col", gap: 2 },
                      children: [
                        { type: "Badge", props: { text: "Best Seller", variant: "success" } },
                        { type: "Text", props: { text: "$3,499", variant: "lead" } },
                        {
                          type: "Flex",
                          props: { direction: "row", gap: 2 },
                          children: [
                            { type: "Button", props: { text: "Add to Cart", variant: "default" } },
                            { type: "Button", props: { text: "Compare", variant: "outline" } },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "Card",
                  props: { title: "iPhone 17 Pro", description: "256GB, Titanium Blue" },
                  children: [
                    {
                      type: "Flex",
                      props: { direction: "col", gap: 2 },
                      children: [
                        { type: "Badge", props: { text: "New", variant: "default" } },
                        { type: "Text", props: { text: "$1,199", variant: "lead" } },
                        {
                          type: "Flex",
                          props: { direction: "row", gap: 2 },
                          children: [
                            { type: "Button", props: { text: "Add to Cart", variant: "default" } },
                            { type: "Button", props: { text: "Compare", variant: "outline" } },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "Card",
                  props: { title: "Sony WH-1000XM6", description: "Wireless Noise-Cancelling Headphones" },
                  children: [
                    {
                      type: "Flex",
                      props: { direction: "col", gap: 2 },
                      children: [
                        { type: "Badge", props: { text: "Popular", variant: "secondary" } },
                        { type: "Text", props: { text: "$399", variant: "lead" } },
                        {
                          type: "Flex",
                          props: { direction: "row", gap: 2 },
                          children: [
                            { type: "Button", props: { text: "Add to Cart", variant: "default" } },
                            { type: "Button", props: { text: "Compare", variant: "outline" } },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "Section",
          props: { title: "Compare Products" },
          children: [
            {
              type: "DataTable",
              props: {
                columns: [
                  { key: "feature", header: "Feature", type: "text" },
                  { key: "macbook", header: "MacBook Pro 16\"", type: "text" },
                  { key: "iphone", header: "iPhone 17 Pro", type: "text" },
                  { key: "sony", header: "Sony WH-1000XM6", type: "text" },
                ],
                data: [
                  { feature: "Price", macbook: "$3,499", iphone: "$1,199", sony: "$399" },
                  { feature: "Battery Life", macbook: "22 hours", iphone: "28 hours", sony: "40 hours" },
                  { feature: "Weight", macbook: "2.14 kg", iphone: "187 g", sony: "254 g" },
                  { feature: "Rating", macbook: "4.8/5", iphone: "4.7/5", sony: "4.9/5" },
                ],
                hoverable: true,
                striped: true,
              },
            },
          ],
        },
      ],
    },
    meta: {
      title: "E-Commerce Product Page",
      description: "Product catalog with cards, comparison table, and cart actions",
    },
  };
}

function getBlogDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "xl" },
      children: [
        {
          type: "Navbar",
          props: { brand: "DevBlog", links: [{ label: "Home", href: "#", active: true }, { label: "Articles", href: "#" }, { label: "Tags", href: "#" }, { label: "About", href: "#" }], showSearch: true },
        },
        {
          type: "Section",
          props: { title: "Latest Articles", description: "Insights on engineering, design, and product development" },
          children: [
            {
              type: "Grid",
              props: { cols: 3, gap: 6 },
              children: [
                { type: "MediaCard", props: { title: "Building Scalable Design Systems", description: "How we built a design system that serves 200+ engineers across 12 teams.", category: "Engineering", author: "Sarah Chen", date: "Feb 15, 2026", readTime: "8 min read" } },
                { type: "MediaCard", props: { title: "AI-Powered Code Review", description: "Lessons learned implementing AI code review for 50,000+ PRs per month.", category: "AI/ML", author: "Marcus Johnson", date: "Feb 12, 2026", readTime: "12 min read" } },
                { type: "MediaCard", props: { title: "The Future of Component Libraries", description: "Why MCP-based component servers will change how we build UIs.", category: "Design", author: "Priya Sharma", date: "Feb 10, 2026", readTime: "6 min read" } },
              ],
            },
          ],
        },
        { type: "Newsletter", props: { title: "Subscribe to our newsletter", description: "Get the latest articles delivered to your inbox. No spam.", placeholder: "you@example.com", buttonText: "Subscribe", variant: "card" } },
      ],
    },
    meta: { title: "Blog Page", description: "Blog with articles, newsletter signup" },
  };
}

function getSettingsDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "lg" },
      children: [
        {
          type: "Section",
          props: { title: "Account Settings", description: "Manage your account preferences" },
          children: [
            {
              type: "Tabs",
              props: { tabs: [{ value: "profile", label: "Profile" }, { value: "notifications", label: "Notifications" }, { value: "security", label: "Security" }], defaultValue: "profile" },
              children: [
                {
                  type: "Card",
                  props: { title: "Personal Information" },
                  children: [
                    {
                      type: "Flex",
                      props: { direction: "col", gap: 4 },
                      children: [
                        { type: "ProfileCard", props: { name: "Sarah Chen", role: "Senior Engineer", bio: "Full-stack developer passionate about design systems and AI.", stats: [{ label: "Projects", value: "24" }, { label: "Contributions", value: "1,847" }, { label: "Following", value: "312" }] } },
                        { type: "Input", props: { label: "Display Name", defaultValue: "Sarah Chen", type: "text" } },
                        { type: "Input", props: { label: "Email", defaultValue: "sarah@company.com", type: "email" } },
                        { type: "Textarea", props: { label: "Bio", defaultValue: "Full-stack developer passionate about design systems.", rows: 3 } },
                        { type: "Button", props: { text: "Save Changes", variant: "default" } },
                      ],
                    },
                  ],
                },
                {
                  type: "Card",
                  props: { title: "Notification Preferences" },
                  children: [
                    {
                      type: "Flex",
                      props: { direction: "col", gap: 3 },
                      children: [
                        { type: "Switch", props: { label: "Email notifications", description: "Receive email for important updates", defaultChecked: true } },
                        { type: "Switch", props: { label: "Push notifications", description: "Receive push notifications on your devices", defaultChecked: false } },
                        { type: "Switch", props: { label: "Weekly digest", description: "Weekly summary of activity", defaultChecked: true } },
                      ],
                    },
                  ],
                },
                {
                  type: "Card",
                  props: { title: "Security" },
                  children: [
                    {
                      type: "Flex",
                      props: { direction: "col", gap: 3 },
                      children: [
                        { type: "Input", props: { label: "Current Password", type: "password", placeholder: "Enter current password" } },
                        { type: "Input", props: { label: "New Password", type: "password", placeholder: "Enter new password" } },
                        { type: "Button", props: { text: "Update Password", variant: "default" } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    meta: { title: "Settings Page", description: "Account settings with profile, notifications, and security tabs" },
  };
}

function getFAQDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "lg" },
      children: [
        {
          type: "Section",
          props: { title: "Frequently Asked Questions", description: "Find answers to common questions" },
          children: [
            {
              type: "FAQ",
              props: {
                variant: "accordion",
                items: [
                  { question: "How does the AI generate UIs?", answer: "Our AI analyzes your prompt, selects appropriate components from our 100+ component library, and composes them into a React Interface Schema. The schema is then rendered in real-time using our built-in component renderers." },
                  { question: "Can I customize the generated output?", answer: "Yes! You can refine any generated UI by providing follow-up prompts. The AI understands context from previous generations and can modify specific parts while keeping the rest intact." },
                  { question: "What component libraries are supported?", answer: "We support shadcn/ui, Chakra UI, Magic UI, Flowbite, DaisyUI, Aceternity UI, and ReactBits patterns. Our 100+ components cover layout, display, input, data, charts, navigation, feedback, and composite patterns." },
                  { question: "Is the generated code production-ready?", answer: "The generated schemas render to fully functional React components with proper accessibility, responsive design, and dark mode support. You can export the schema JSON and integrate it into any React project." },
                  { question: "What AI providers are supported?", answer: "We support Google Gemini (default), OpenAI GPT-4, and Anthropic Claude. You can configure your preferred provider via environment variables." },
                ],
              },
            },
          ],
        },
        { type: "CTA", props: { headline: "Still have questions?", description: "Our support team is here to help you get started.", primaryAction: "Contact Support", secondaryAction: "View Docs", variant: "centered" } },
      ],
    },
    meta: { title: "FAQ Page", description: "FAQ page with accordion and CTA" },
  };
}

function getChatDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "lg" },
      children: [
        {
          type: "Section",
          props: { title: "AI Assistant", description: "Chat with our AI to generate UIs" },
          children: [
            {
              type: "Chat",
              props: {
                title: "Gen UI Assistant",
                showInput: true,
                messages: [
                  { id: "1", role: "assistant", content: "Hello! I can help you generate UIs. What would you like to build?", timestamp: "10:00 AM" },
                  { id: "2", role: "user", content: "I need a dashboard with sales metrics and charts", timestamp: "10:01 AM" },
                  { id: "3", role: "assistant", content: "I'll create a sales dashboard with KPI cards, area chart for revenue trends, and a data table for recent transactions. Give me a moment...", timestamp: "10:01 AM" },
                  { id: "4", role: "assistant", content: "Done! I've generated a dashboard with 4 KPI cards (revenue, users, conversion rate, AOV), a revenue trend area chart, a bar chart for regional sales, and a transaction history table. You can see the preview on the right.", timestamp: "10:02 AM" },
                  { id: "5", role: "user", content: "Can you add a pie chart for traffic sources?", timestamp: "10:03 AM" },
                  { id: "6", role: "assistant", content: "Sure! I've added a donut chart showing traffic sources: Organic Search (40%), Direct (25%), Social Media (20%), and Referrals (15%). Check the updated preview.", timestamp: "10:03 AM" },
                ],
              },
            },
          ],
        },
      ],
    },
    meta: { title: "Chat Interface", description: "AI chat assistant for UI generation" },
  };
}

function getChangelogDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "lg" },
      children: [
        {
          type: "Section",
          props: { title: "Changelog", description: "What's new in Generative UI Platform" },
          children: [
            {
              type: "Changelog",
              props: {
                entries: [
                  { version: "2.0.0", date: "Feb 17, 2026", title: "100 Component Library", description: "Massively expanded from 35 to 100 components covering all major UI patterns.", type: "feature", items: ["Added 65 new components across 9 categories", "Full chart suite with Radar and Scatter", "Feedback components: Alert, Toast, Dialog, Drawer", "Composite templates: FAQ, Team, Calendar, Weather, Terminal"] },
                  { version: "1.5.0", date: "Feb 15, 2026", title: "Gemini AI Default", description: "Added Google Gemini as the default AI provider with auto-fallback.", type: "feature", items: ["Google Gemini 2.0 Flash as default", "Auto-fallback to OpenAI/Anthropic", "Streaming generation support"] },
                  { version: "1.4.0", date: "Feb 10, 2026", title: "Dark Mode & Theming", description: "Complete dark mode support with dynamic theme generation.", type: "improvement", items: ["HSL-based palette generation", "One-click theme from any brand color", "CSS variable injection"] },
                  { version: "1.3.0", date: "Feb 5, 2026", title: "Breaking: Schema v1.0", description: "New React Interface Schema format with strict typing.", type: "breaking", items: ["New schema format (v1.0)", "Zod validation for all props", "Migration guide available"] },
                ],
              },
            },
          ],
        },
      ],
    },
    meta: { title: "Changelog", description: "Product changelog with versioned releases" },
  };
}

function getFileExplorerDemo(): ReactInterfaceSchema {
  return {
    version: "1.0",
    root: {
      type: "Container",
      props: { maxWidth: "xl" },
      children: [
        {
          type: "Section",
          props: { title: "Project Files", description: "Browse the project structure" },
          children: [
            {
              type: "Grid",
              props: { cols: 2, gap: 6 },
              children: [
                {
                  type: "FileExplorer",
                  props: {
                    files: [
                      { name: "src", type: "folder", modified: "Feb 17", children: [{ name: "app", type: "folder" }, { name: "components", type: "folder" }, { name: "lib", type: "folder" }, { name: "types", type: "folder" }] },
                      { name: "docs", type: "folder", modified: "Feb 15", children: [{ name: "architecture.html", type: "file", size: "24 KB" }, { name: "api-reference.md", type: "file", size: "8 KB" }] },
                      { name: "package.json", type: "file", size: "1.2 KB", modified: "Feb 17" },
                      { name: "tsconfig.json", type: "file", size: "0.6 KB", modified: "Feb 10" },
                      { name: ".env.example", type: "file", size: "0.3 KB", modified: "Feb 15" },
                    ],
                  },
                },
                {
                  type: "Terminal",
                  props: {
                    title: "dev-server",
                    showHeader: true,
                    lines: [
                      { type: "input", content: "npm run dev", prompt: "~/ui-generator $ " },
                      { type: "output", content: "  ▲ Next.js 15.2.0" },
                      { type: "output", content: "  - Local:    http://localhost:3000" },
                      { type: "output", content: "  - Network:  http://192.168.1.100:3000" },
                      { type: "output", content: "" },
                      { type: "output", content: " ✓ Ready in 1.2s" },
                      { type: "output", content: " ○ Compiling /api/generate ..." },
                      { type: "output", content: " ✓ Compiled /api/generate in 340ms" },
                      { type: "input", content: "", prompt: "~/ui-generator $ " },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    meta: { title: "File Explorer", description: "Project file browser with terminal" },
  };
}

export { defaultDarkTheme };
