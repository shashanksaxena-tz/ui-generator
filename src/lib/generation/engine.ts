import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
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

/**
 * Get the AI provider based on environment configuration.
 */
function getProvider() {
  const providerName = process.env.AI_PROVIDER ?? "openai";
  const model = process.env.AI_MODEL ?? "gpt-4o";

  if (providerName === "anthropic") {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return anthropic(model || "claude-sonnet-4-20250514");
  }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai(model || "gpt-4o");
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

  // Check cache first
  const cached = schemaCache.get(request.prompt);
  if (cached) {
    return {
      schema: cached,
      theme: request.theme ? generateTheme({
        brandColor: request.theme.colors?.primary?.[500],
        mode: request.theme.mode,
      }) : undefined,
      metadata: {
        tokensUsed: 0,
        model: "cache",
        generationTimeMs: Date.now() - startTime,
        componentsUsed: extractComponentNames(cached),
        cachedLayout: true,
      },
    };
  }

  const systemPrompt = buildSystemPrompt(request.constraints, request.theme as ThemeConfig);

  // Build user message
  let userMessage = request.prompt;
  if (request.context?.previousSchema) {
    userMessage = buildRefinementPrompt(
      JSON.stringify(request.context.previousSchema, null, 2),
      request.prompt
    );
  }

  const model = getProvider();

  const result = await generateText({
    model,
    system: systemPrompt,
    prompt: userMessage,
    maxTokens: 8192,
    temperature: 0.7,
  });

  // Parse the schema from LLM response
  let schema: ReactInterfaceSchema;
  try {
    schema = parseSchemaResponse(result.text);
  } catch (parseError) {
    throw new Error(
      `Failed to parse generated schema: ${parseError instanceof Error ? parseError.message : "Unknown error"}`
    );
  }

  // Validate and apply defaults
  const validationErrors = validateSchema(schema);
  if (validationErrors.length > 0) {
    console.warn("Schema validation warnings:", validationErrors);
  }

  schema = applyDefaults(schema);

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
      model: process.env.AI_MODEL ?? "gpt-4o",
      generationTimeMs: Date.now() - startTime,
      componentsUsed,
      cachedLayout: false,
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

export { defaultDarkTheme };
