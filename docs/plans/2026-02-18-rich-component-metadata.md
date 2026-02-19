# Rich Component Metadata Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the flat, single-category component registry with a component-centric metadata system that gives every component multiple intent categories, structured behavioral dimensions, natural-language aliases, and LLM guidance — eliminating the "wrong category returns 6 components" failure mode.

**Architecture:**
Each component in `components.ts` gets a rich `ComponentMeta` object with: multi-category assignment, `behavior`/`type`/`function`/`location`/`library` dimensions, an `aliases` array (natural-language names users actually say), and a `whenToUse` string the LLM can read.
`category-mappings.ts` is refactored to **derive** its lists from the registry instead of maintaining a separate manual list — one source of truth.
`component-selection.ts` gains a first-pass alias matcher that always surfaces explicitly-named components before the LLM category selector runs.

**Tech Stack:** TypeScript, Zod (existing), no new dependencies

---

## Task 1: Add New Type Definitions

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Read the current types file**

```bash
cat src/types/index.ts
```

**Step 2: Add new types after the existing `ComponentCategory` type**

Find the `ComponentCategory` type and add these new types directly after it:

```typescript
// ── Rich metadata types ──────────────────────────────────────────────────

export type ComponentBehavior =
  | "static"       // renders without animation
  | "animated"     // has built-in CSS/JS animations
  | "interactive"  // responds to user input events
  | "data-driven"; // renders dynamically based on data props

export type ComponentType =
  | "layout"      // structural wrapper, arranges children
  | "display"     // shows content, no interaction
  | "navigation"  // moves between views or pages
  | "input"       // captures user input
  | "chart"       // data visualization
  | "effect"      // visual effect or background
  | "overlay"     // floats above page content
  | "media"       // images, video, audio
  | "feedback"    // system response (alerts, toasts)
  | "composite";  // pre-built section combining multiple sub-components

export type PageLocation =
  | "full-page"     // occupies full viewport
  | "above-fold"    // visible without scrolling
  | "header"        // top of page
  | "main-content"  // primary content area
  | "sidebar"       // side panel
  | "footer"        // bottom of page
  | "overlay"       // floats above content
  | "inline";       // embedded within content flow

export type ComponentLibrary =
  | "core"       // shadcn/ui based or custom
  | "aceternity" // Aceternity UI
  | "magic-ui"   // Magic UI
  | "react-bits" // React Bits
  | "chakra"     // Chakra UI
  | "material"   // Material UI
  | "shadcn";    // shadcn/ui direct

// Intent categories (used for selection filtering) — extends the existing CategoryKey
// Add these new keys to the categoryMappings in category-mappings.ts in Task 13
export type IntentCategory =
  // Page types
  | "dashboard" | "landing page" | "form" | "ecommerce" | "blog"
  // Visual styles
  | "animated" | "3d" | "glassmorphism" | "neon" | "gradient"
  // Component types
  | "cards" | "buttons" | "charts" | "data" | "navigation"
  | "backgrounds" | "text" | "parallax" | "hover" | "scroll"
  // Use-case categories
  | "media" | "profile" | "authentication" | "analytics" | "marketing"
  | "notifications" | "modals" | "feedback" | "tables" | "calendar"
  | "files" | "chat" | "search" | "widgets" | "social" | "admin"
  | "mobile" | "desktop" | "loading" | "empty"
  // NEW categories added in this plan
  | "showcase"     // feature showcase, portfolio, demo pages
  | "carousel"     // scrolling/looping content displays
  | "testimonials" // social proof, reviews, quotes
  | "pricing"      // pricing tables and plan comparisons
  | "portfolio"    // project/work showcase
  | "hero"         // hero section components specifically
  | "dock"         // dock-style navigation
  | "backgrounds-animated"; // animated background effects specifically

export interface ComponentMeta {
  description: string;
  allowedChildren?: string[];

  // Multi-category (replaces single ComponentCategory)
  categories: IntentCategory[];

  // Structured behavioral dimensions
  behavior: ComponentBehavior;
  type: ComponentType;
  function: string;         // free-form role, e.g. "persistent-nav", "hero-section"
  location: PageLocation[]; // where on a page this typically lives

  // Library provenance
  library: ComponentLibrary;

  // LLM discovery fields
  aliases: string[];   // natural-language names the user might say
  whenToUse: string;  // one sentence guiding the LLM on when to choose this

  // General search tags (retained from original)
  tags: string[];
}
```

**Step 3: Verify the file compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: zero errors, or only unrelated pre-existing errors.

**Step 4: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add ComponentMeta, ComponentBehavior, ComponentType, PageLocation, IntentCategory types"
```

---

## Task 2: Update RegistryEntry Interface in components.ts

**Files:**
- Modify: `src/lib/registry/components.ts`

**Step 1: Replace the `RegistryEntry` interface with `ComponentMeta`**

Find this block (lines 13–18):
```typescript
interface RegistryEntry {
  description: string;
  category: ComponentCategory;
  tags: string[];
  allowedChildren?: string[];
}
```

Replace with:
```typescript
import type { ComponentMeta } from "@/types";
// (add this to the existing imports at the top — ComponentMeta replaces RegistryEntry)
```

Then change the registry type declaration from:
```typescript
const registry: Record<ComponentName, RegistryEntry> = {
```
to:
```typescript
const registry: Record<ComponentName, ComponentMeta> = {
```

**Step 2: Update `getComponentMeta` and related exports**

Find any function in `components.ts` that reads `.category` (single) and update to `.categories[0]` for backward compat, or update call sites. Search:

```bash
grep -n "\.category" src/lib/registry/components.ts
grep -n "\.category" src/lib/generation/
grep -rn "\.category" src/
```

For each usage of `.category` (single), change to `.categories[0]` as a safe shim until callers are updated.

**Step 3: Verify compile**

```bash
npx tsc --noEmit 2>&1 | head -40
```

TypeScript will flag every component entry as missing the new required fields — that's expected. The next tasks fill them in.

**Step 4: Commit**

```bash
git add src/lib/registry/components.ts src/types/index.ts
git commit -m "feat: migrate RegistryEntry to ComponentMeta interface (compilation errors expected until metadata added)"
```

---

## Task 3: Core Layout & Display Components (22 components)

**Files:**
- Modify: `src/lib/registry/components.ts` — update entries for all layout and display components

**Components in this batch:** Flex, Grid, Container, Section, Stack, AspectRatio, Center, Wrap, Spacer, Divider, Heading, Text, Badge, Avatar, Separator, Image, Icon, Code, Blockquote, Callout, Kbd, Timeline, Skeleton, Spinner

Replace each entry with the full metadata below:

```typescript
  Flex: {
    description: "Flexbox layout container. Arranges children in a row or column with configurable gap, alignment, and justification.",
    categories: ["dashboard","form","landing page","navigation","admin","blog"],
    behavior: "static", type: "layout", function: "flex-container",
    location: ["inline"],
    library: "core",
    aliases: ["flexbox","flex layout","row layout","column layout","horizontal layout","vertical layout"],
    whenToUse: "Use for any horizontal or vertical arrangement of elements with gap and alignment control.",
    tags: ["layout","flexbox","container"],
    allowedChildren: ["*"],
  },

  Grid: {
    description: "CSS Grid layout container. Arranges children in a responsive grid with configurable columns and gap.",
    categories: ["dashboard","landing page","blog","ecommerce","cards"],
    behavior: "static", type: "layout", function: "grid-container",
    location: ["main-content"],
    library: "core",
    aliases: ["grid","css grid","responsive grid","multi-column layout","column grid"],
    whenToUse: "Use for multi-column responsive layouts when you need defined column/row structure.",
    tags: ["layout","grid","container"],
    allowedChildren: ["*"],
  },

  Container: {
    description: "Centered content container with max-width constraint. Use as outer wrapper for page sections.",
    categories: ["landing page","dashboard","blog","form","marketing","admin"],
    behavior: "static", type: "layout", function: "page-wrapper",
    location: ["full-page"],
    library: "core",
    aliases: ["container","page container","content wrapper","max-width wrapper","outer wrapper"],
    whenToUse: "Use as the outermost wrapper for any page or section to constrain content width.",
    tags: ["layout","container","wrapper"],
    allowedChildren: ["*"],
  },

  Section: {
    description: "Page section with optional title and description. Groups related content with vertical spacing.",
    categories: ["landing page","dashboard","blog","marketing","admin"],
    behavior: "static", type: "layout", function: "content-section",
    location: ["main-content"],
    library: "core",
    aliases: ["section","page section","content block","section wrapper","content group"],
    whenToUse: "Use to group related content into labeled sections with a title and description.",
    tags: ["layout","section","grouping"],
    allowedChildren: ["*"],
  },

  Stack: {
    description: "Linear layout container arranging children vertically or horizontally with consistent spacing and optional dividers.",
    categories: ["form","dashboard","cards","blog"],
    behavior: "static", type: "layout", function: "stack-container",
    location: ["inline"],
    library: "core",
    aliases: ["stack","vertical stack","horizontal stack","stacked layout","spaced list"],
    whenToUse: "Use for consistent spacing between a series of vertically or horizontally stacked elements.",
    tags: ["layout","stack","spacing","container"],
    allowedChildren: ["*"],
  },

  AspectRatio: {
    description: "Constrains child content to a specific aspect ratio (1:1, 4:3, 16:9, 21:9).",
    categories: ["media","ecommerce","blog"],
    behavior: "static", type: "layout", function: "aspect-container",
    location: ["inline"],
    library: "core",
    aliases: ["aspect ratio","16:9 container","video container","square container","image aspect"],
    whenToUse: "Use to maintain a fixed aspect ratio for images, videos, or embedded media.",
    tags: ["layout","aspect-ratio","media","container"],
    allowedChildren: ["*"],
  },

  Center: {
    description: "Centers its children both horizontally and vertically within the available space.",
    categories: ["landing page","empty","marketing"],
    behavior: "static", type: "layout", function: "centering",
    location: ["inline"],
    library: "core",
    aliases: ["center","centered content","centered layout","centered container"],
    whenToUse: "Use to center content both horizontally and vertically.",
    tags: ["layout","center","alignment","container"],
    allowedChildren: ["*"],
  },

  Wrap: {
    description: "Wrapping layout that flows children into the next line when they exceed container width.",
    categories: ["dashboard","ecommerce","cards"],
    behavior: "static", type: "layout", function: "wrap-container",
    location: ["inline"],
    library: "core",
    aliases: ["flex wrap","wrapping layout","tag cloud","chip wrap","pill wrap"],
    whenToUse: "Use when items should wrap to the next row when the container runs out of horizontal space.",
    tags: ["layout","wrap","flow","container"],
    allowedChildren: ["*"],
  },

  Heading: {
    description: "Typography heading element (h1-h6). Use for titles and section headers.",
    categories: ["landing page","dashboard","blog","marketing","text"],
    behavior: "static", type: "display", function: "section-title",
    location: ["above-fold","main-content"],
    library: "core",
    aliases: ["heading","title","header text","page title","h1","h2","h3","section heading"],
    whenToUse: "Use for titles and section headers at any heading level (h1–h6).",
    tags: ["typography","heading","title"],
  },

  Text: {
    description: "Typography text element with variants: body, lead, small, muted, code.",
    categories: ["landing page","dashboard","blog","marketing","text","form"],
    behavior: "static", type: "display", function: "body-text",
    location: ["inline"],
    library: "core",
    aliases: ["text","paragraph","body text","description","caption","label","copy"],
    whenToUse: "Use for body paragraphs, descriptions, labels, and any non-heading copy.",
    tags: ["typography","text","paragraph"],
  },

  Badge: {
    description: "Small label/tag for status or categories. Variants: default, secondary, outline, destructive, success, warning.",
    categories: ["ecommerce","dashboard","blog","cards","data","social"],
    behavior: "static", type: "display", function: "status-label",
    location: ["inline"],
    library: "core",
    aliases: ["badge","tag","chip","label","pill","status indicator","category tag"],
    whenToUse: "Use to show status, categories, or small metadata labels on cards or lists.",
    tags: ["badge","tag","label","status"],
  },

  Avatar: {
    description: "User avatar with image or fallback initials. Sizes: sm, md, lg.",
    categories: ["profile","social","chat","blog"],
    behavior: "static", type: "display", function: "user-avatar",
    location: ["inline"],
    library: "core",
    aliases: ["avatar","user photo","profile picture","initials","user icon"],
    whenToUse: "Use for displaying user photos or initials in profile, chat, comment, or team contexts.",
    tags: ["avatar","user","image"],
  },

  Separator: {
    description: "Visual divider line. Horizontal or vertical orientation.",
    categories: ["dashboard","blog","form"],
    behavior: "static", type: "display", function: "visual-separator",
    location: ["inline"],
    library: "core",
    aliases: ["separator","divider","horizontal rule","hr","line divider"],
    whenToUse: "Use to visually separate content sections or items.",
    tags: ["divider","separator","line"],
  },

  Image: {
    description: "Image display with alt text. Supports responsive sizing.",
    categories: ["blog","ecommerce","media","landing page","cards"],
    behavior: "static", type: "media", function: "image-display",
    location: ["inline","main-content"],
    library: "core",
    aliases: ["image","photo","picture","img","thumbnail","illustration"],
    whenToUse: "Use to display images with proper alt text and responsive sizing.",
    tags: ["image","media","picture"],
  },

  Icon: {
    description: "Icon display component. Renders named icons at configurable sizes with optional color.",
    categories: ["dashboard","navigation","form","landing page"],
    behavior: "static", type: "display", function: "icon-display",
    location: ["inline"],
    library: "core",
    aliases: ["icon","symbol","glyph","pictogram","svg icon"],
    whenToUse: "Use to add visual icon symbols alongside text or as standalone indicators.",
    tags: ["icon","symbol","graphic"],
  },

  Code: {
    description: "Syntax-highlighted code block with line numbers, language detection, and optional title.",
    categories: ["blog","files","text"],
    behavior: "static", type: "display", function: "code-display",
    location: ["main-content","inline"],
    library: "core",
    aliases: ["code block","syntax highlight","code snippet","code sample","code display"],
    whenToUse: "Use to display formatted code with syntax highlighting.",
    tags: ["code","syntax","programming","snippet"],
  },

  Blockquote: {
    description: "Styled blockquote for quotations with optional author and source attribution.",
    categories: ["blog","text"],
    behavior: "static", type: "display", function: "quotation",
    location: ["inline"],
    library: "core",
    aliases: ["blockquote","quote","pull quote","citation","testimonial quote"],
    whenToUse: "Use to highlight quotations with optional author attribution.",
    tags: ["blockquote","quote","citation"],
  },

  Callout: {
    description: "Highlighted information box with variants: info, warning, error, success, tip.",
    categories: ["blog","dashboard","text"],
    behavior: "static", type: "display", function: "callout-box",
    location: ["inline"],
    library: "core",
    aliases: ["callout","info box","note box","tip box","warning box","admonition"],
    whenToUse: "Use to highlight important information, warnings, tips, or notes inline.",
    tags: ["callout","notice","alert","info"],
  },

  Kbd: {
    description: "Keyboard shortcut display. Renders key combinations with a configurable separator.",
    categories: ["blog","desktop","text"],
    behavior: "static", type: "display", function: "keyboard-key",
    location: ["inline"],
    library: "core",
    aliases: ["keyboard shortcut","key combination","hotkey","kbd","keyboard key"],
    whenToUse: "Use to display keyboard shortcuts or key combinations inline in text.",
    tags: ["keyboard","shortcut","keys"],
  },

  Timeline: {
    description: "Vertical or horizontal timeline showing a sequence of events with status, date, and description.",
    categories: ["blog","profile","dashboard","analytics"],
    behavior: "static", type: "display", function: "timeline-display",
    location: ["main-content"],
    library: "core",
    aliases: ["timeline","event history","activity feed","event log","chronology","history"],
    whenToUse: "Use to display chronological events, history, activity feeds, or step-by-step progress.",
    tags: ["timeline","events","history","steps"],
  },

  Skeleton: {
    description: "Loading placeholder skeleton. Variants: text, circular, rectangular, card.",
    categories: ["loading","dashboard","blog"],
    behavior: "animated", type: "display", function: "loading-placeholder",
    location: ["inline"],
    library: "core",
    aliases: ["skeleton loader","loading skeleton","placeholder","shimmer placeholder","ghost"],
    whenToUse: "Use as a loading placeholder that mimics content layout while data is fetching.",
    tags: ["skeleton","loading","placeholder"],
  },

  Spinner: {
    description: "Loading spinner indicator with configurable size and optional label text.",
    categories: ["loading","feedback"],
    behavior: "animated", type: "display", function: "loading-indicator",
    location: ["inline","overlay"],
    library: "core",
    aliases: ["spinner","loading indicator","loader","activity indicator","loading spinner"],
    whenToUse: "Use to indicate an ongoing loading or processing state.",
    tags: ["spinner","loading","indicator"],
  },
```

**Step 3: Verify compile after batch**

```bash
npx tsc --noEmit 2>&1 | grep "error" | wc -l
```

Number of errors should decrease with each batch.

**Step 4: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: add rich metadata to layout and display components (batch 1/8)"
```

---

## Task 4: Card & Marketing Composite Components (18 components)

**Files:**
- Modify: `src/lib/registry/components.ts`

**Components:** Card, KPICard, StatCard, ProfileCard, MediaCard, InfoCard, Hero, FeatureGrid, Testimonial, PricingTable, CTA, LogoCloud, FAQ, Newsletter, Footer, StatsGrid, Team, Comparison

```typescript
  Card: {
    description: "Generic card container with optional title and description.",
    categories: ["dashboard","landing page","blog","ecommerce","cards","showcase"],
    behavior: "static", type: "composite", function: "content-card",
    location: ["inline","main-content"],
    library: "core",
    aliases: ["card","panel","box","container card","rounded box"],
    whenToUse: "Use as a generic container for content in a bordered, rounded box.",
    tags: ["card","container","panel"],
    allowedChildren: ["*"],
  },

  KPICard: {
    description: "Key Performance Indicator card showing metric value, title, and optional trend indicator.",
    categories: ["dashboard","analytics","admin"],
    behavior: "static", type: "composite", function: "kpi-metric",
    location: ["above-fold","main-content"],
    library: "core",
    aliases: ["KPI card","metric card","key metric","number card","performance indicator","stat tile"],
    whenToUse: "Use for displaying key performance indicators with value, label, and trend direction.",
    tags: ["kpi","metric","dashboard","stat"],
  },

  StatCard: {
    description: "Statistics card with value, label, and optional trend indicator.",
    categories: ["dashboard","analytics","admin"],
    behavior: "static", type: "composite", function: "stat-metric",
    location: ["above-fold","main-content"],
    library: "core",
    aliases: ["stat card","statistics card","metric card","analytics card","stat tile"],
    whenToUse: "Use for displaying statistics with trend indicators in dashboards.",
    tags: ["stat","metric","analytics"],
  },

  ProfileCard: {
    description: "User profile card displaying name, role, avatar, bio, stats, and social links.",
    categories: ["profile","social","team"],
    behavior: "static", type: "composite", function: "user-profile",
    location: ["main-content","sidebar"],
    library: "core",
    aliases: ["profile card","user card","team member card","bio card","person card"],
    whenToUse: "Use to display a user or team member's profile with photo, name, role, and bio.",
    tags: ["profile","card","user","bio"],
  },

  MediaCard: {
    description: "Content media card with image, title, description, category, author, and read time.",
    categories: ["blog","media","ecommerce"],
    behavior: "static", type: "composite", function: "content-preview",
    location: ["main-content"],
    library: "core",
    aliases: ["article card","blog card","post card","content card","news card","media card"],
    whenToUse: "Use for blog posts, articles, or media items with image, title, author, and metadata.",
    tags: ["media","card","article","blog","content"],
  },

  InfoCard: {
    description: "Informational card with icon, title, value, and description. Variants: default, bordered, filled.",
    categories: ["dashboard","landing page","marketing","showcase"],
    behavior: "static", type: "composite", function: "info-display",
    location: ["main-content"],
    library: "core",
    aliases: ["info card","feature card","detail card","icon card","highlight card"],
    whenToUse: "Use to display information items with an icon, title, value, and short description.",
    tags: ["info","card","detail","summary"],
  },

  Hero: {
    description: "Full-width hero section with headline, description, CTA buttons, and optional image.",
    categories: ["landing page","marketing","showcase","hero"],
    behavior: "static", type: "composite", function: "hero-section",
    location: ["above-fold"],
    library: "core",
    aliases: ["hero","hero section","hero banner","main banner","page hero","above the fold","jumbotron","splash"],
    whenToUse: "Use as the primary hero section at the top of landing pages with headline and CTA.",
    tags: ["hero","landing","banner","cta"],
  },

  FeatureGrid: {
    description: "Grid layout showcasing product features with icons, titles, and descriptions.",
    categories: ["landing page","marketing","showcase"],
    behavior: "static", type: "composite", function: "feature-showcase",
    location: ["main-content"],
    library: "core",
    aliases: ["feature grid","features section","feature list","capabilities","what we offer","features"],
    whenToUse: "Use to showcase product or service features in a grid layout.",
    tags: ["features","grid","landing"],
  },

  Testimonial: {
    description: "Individual testimonial card with quote, author name, role, and avatar.",
    categories: ["landing page","marketing","social","testimonials","showcase"],
    behavior: "static", type: "composite", function: "social-proof",
    location: ["main-content"],
    library: "core",
    aliases: ["testimonial","review","customer quote","social proof","customer review","user quote"],
    whenToUse: "Use to display individual customer testimonials or reviews.",
    tags: ["testimonial","review","social-proof"],
  },

  PricingTable: {
    description: "Pricing plans table with feature comparison and CTA buttons per tier.",
    categories: ["landing page","marketing","ecommerce","tables","pricing"],
    behavior: "static", type: "composite", function: "pricing-display",
    location: ["main-content"],
    library: "core",
    aliases: ["pricing table","pricing plans","subscription tiers","pricing cards","plan comparison","price list"],
    whenToUse: "Use to display product or subscription pricing with tier comparisons.",
    tags: ["pricing","plans","table","comparison"],
  },

  CTA: {
    description: "Call-to-action section with headline, description, and prominent action button.",
    categories: ["landing page","marketing"],
    behavior: "static", type: "composite", function: "call-to-action",
    location: ["main-content","above-fold","footer"],
    library: "core",
    aliases: ["CTA","call to action","signup section","conversion section","get started","action section"],
    whenToUse: "Use for prominent conversion sections with a headline, description, and action button.",
    tags: ["cta","conversion","landing"],
  },

  LogoCloud: {
    description: "Grid of partner, client, or technology logos for social proof.",
    categories: ["landing page","marketing","showcase"],
    behavior: "static", type: "composite", function: "logo-cloud",
    location: ["main-content","above-fold"],
    library: "core",
    aliases: ["logo cloud","partner logos","client logos","brand logos","trust logos","as seen in","powered by","used by"],
    whenToUse: "Use to display client, partner, or technology logos for social proof.",
    tags: ["logos","brands","social-proof"],
  },

  FAQ: {
    description: "Accordion-based FAQ section with expandable question/answer pairs.",
    categories: ["landing page","marketing"],
    behavior: "interactive", type: "composite", function: "faq-section",
    location: ["main-content"],
    library: "core",
    aliases: ["FAQ","frequently asked questions","accordion FAQ","help section","questions and answers","Q&A"],
    whenToUse: "Use for FAQ sections where users expand/collapse questions to see answers.",
    tags: ["faq","accordion","help"],
  },

  Newsletter: {
    description: "Email newsletter signup form with headline and input.",
    categories: ["landing page","marketing","blog"],
    behavior: "interactive", type: "composite", function: "email-signup",
    location: ["main-content","footer"],
    library: "core",
    aliases: ["newsletter","email signup","subscribe","newsletter signup","email capture","mailing list"],
    whenToUse: "Use for email newsletter signup sections.",
    tags: ["newsletter","email","signup"],
  },

  Footer: {
    description: "Site footer with links, company info, and legal text.",
    categories: ["landing page","blog","ecommerce","marketing","admin"],
    behavior: "static", type: "composite", function: "page-footer",
    location: ["footer"],
    library: "core",
    aliases: ["footer","site footer","page footer","bottom section","bottom navigation"],
    whenToUse: "Use as the bottom section of pages with navigation links, legal text, and company info.",
    tags: ["footer","navigation","links"],
  },

  StatsGrid: {
    description: "Grid of impact statistics or metrics, often used for social proof.",
    categories: ["landing page","dashboard","analytics","marketing","showcase"],
    behavior: "static", type: "composite", function: "stats-display",
    location: ["main-content","above-fold"],
    library: "core",
    aliases: ["stats grid","statistics section","numbers section","metrics grid","key stats","impact numbers","achievement stats"],
    whenToUse: "Use to display impactful statistics or metrics in a grid, e.g. '10M users, 99.9% uptime'.",
    tags: ["stats","metrics","grid"],
  },

  Team: {
    description: "Grid of team members with photos, names, roles, and optional social links.",
    categories: ["landing page","profile","social","marketing"],
    behavior: "static", type: "composite", function: "team-display",
    location: ["main-content"],
    library: "core",
    aliases: ["team","team members","our team","staff section","people section","meet the team"],
    whenToUse: "Use to showcase team members with their photos, names, and roles.",
    tags: ["team","people","profile"],
  },

  Comparison: {
    description: "Side-by-side comparison table for products, plans, or options.",
    categories: ["ecommerce","tables","marketing"],
    behavior: "static", type: "composite", function: "comparison-table",
    location: ["main-content"],
    library: "core",
    aliases: ["comparison table","vs table","side by side comparison","feature comparison","plan comparison"],
    whenToUse: "Use to compare products, plans, or options side by side in a table.",
    tags: ["comparison","table","product"],
  },
```

**Step 3: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: add rich metadata to card and marketing composite components (batch 2/8)"
```

---

## Task 5: Navigation & Input Components (27 components)

**Files:**
- Modify: `src/lib/registry/components.ts`

**Components:** Tabs, Breadcrumb, Navbar, Sidebar, Stepper, MenuBar, BottomNav, Dock, PaginationNav, CommandMenu, CommandPalette, **FloatingDock**, Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, DatePicker, ColorPicker, FileUpload, Rating, NumberInput, Form

```typescript
  Tabs: {
    description: "Tab navigation component switching between content panels.",
    categories: ["dashboard","admin","profile","navigation"],
    behavior: "interactive", type: "navigation", function: "tabbed-content",
    location: ["main-content","header"],
    library: "core",
    aliases: ["tabs","tab bar","tabbed view","tab navigation","tab switcher"],
    whenToUse: "Use for switching between related content sections within the same view.",
    tags: ["tabs","navigation","panels"],
  },

  Breadcrumb: {
    description: "Breadcrumb trail showing the user's current location in a site hierarchy.",
    categories: ["blog","ecommerce","admin","navigation"],
    behavior: "static", type: "navigation", function: "page-hierarchy",
    location: ["header","main-content"],
    library: "core",
    aliases: ["breadcrumb","breadcrumbs","page path","navigation trail","you are here"],
    whenToUse: "Use to show the user's current location in a site hierarchy.",
    tags: ["breadcrumb","navigation","hierarchy"],
  },

  Navbar: {
    description: "Top navigation bar with logo, links, and optional CTA.",
    categories: ["landing page","blog","ecommerce","admin","navigation"],
    behavior: "static", type: "navigation", function: "primary-nav",
    location: ["header"],
    library: "core",
    aliases: ["navbar","navigation bar","nav bar","site header","top navigation","top nav","header nav"],
    whenToUse: "Use for the primary top navigation bar of a website or application.",
    tags: ["navbar","navigation","header"],
  },

  Sidebar: {
    description: "Persistent side navigation panel with collapsible sections.",
    categories: ["dashboard","admin","desktop","navigation"],
    behavior: "interactive", type: "navigation", function: "side-navigation",
    location: ["sidebar"],
    library: "core",
    aliases: ["sidebar","side panel","side navigation","nav sidebar","left nav","vertical nav"],
    whenToUse: "Use for persistent side navigation in dashboards and admin panels.",
    tags: ["sidebar","navigation","panel"],
  },

  Stepper: {
    description: "Step indicator for multi-step processes with progress tracking.",
    categories: ["form","navigation"],
    behavior: "interactive", type: "navigation", function: "step-indicator",
    location: ["above-fold","main-content"],
    library: "core",
    aliases: ["stepper","step progress","wizard steps","multi-step","progress steps","step indicator"],
    whenToUse: "Use to guide users through multi-step processes like forms, onboarding, or checkout.",
    tags: ["stepper","steps","progress","wizard"],
  },

  MenuBar: {
    description: "Desktop-style horizontal menu bar with dropdown submenus.",
    categories: ["admin","desktop","navigation"],
    behavior: "interactive", type: "navigation", function: "menu-bar",
    location: ["header"],
    library: "core",
    aliases: ["menu bar","app menu","action bar","toolbar menu","menu strip"],
    whenToUse: "Use for desktop-style menu bars with File/Edit/View style dropdown menus.",
    tags: ["menu","navigation","desktop"],
  },

  BottomNav: {
    description: "Mobile bottom navigation bar with icon+label tabs.",
    categories: ["mobile","navigation"],
    behavior: "static", type: "navigation", function: "mobile-nav",
    location: ["footer"],
    library: "core",
    aliases: ["bottom nav","tab bar","mobile navigation","bottom tabs","mobile footer nav"],
    whenToUse: "Use for mobile app-style bottom navigation with 3–5 tab items.",
    tags: ["bottom-nav","mobile","navigation"],
  },

  Dock: {
    description: "Desktop-style icon-based dock navigation.",
    categories: ["desktop","navigation","dock"],
    behavior: "static", type: "navigation", function: "dock-nav",
    location: ["footer","sidebar"],
    library: "core",
    aliases: ["dock","application dock","icon dock","launcher","taskbar"],
    whenToUse: "Use for desktop-style icon-based dock or taskbar navigation.",
    tags: ["dock","desktop","navigation"],
  },

  PaginationNav: {
    description: "Pagination controls for navigating multi-page content.",
    categories: ["blog","ecommerce","data","navigation","tables"],
    behavior: "interactive", type: "navigation", function: "pagination",
    location: ["footer","main-content"],
    library: "core",
    aliases: ["pagination","page navigation","prev next","page links","page numbers"],
    whenToUse: "Use to navigate between pages of content.",
    tags: ["pagination","navigation","pages"],
  },

  CommandMenu: {
    description: "Keyboard-driven command search interface (Cmd+K style).",
    categories: ["admin","desktop","search","navigation"],
    behavior: "interactive", type: "overlay", function: "command-palette",
    location: ["overlay"],
    library: "core",
    aliases: ["command menu","command palette","spotlight","quick search","cmd+k","Cmd+K","keyboard launcher"],
    whenToUse: "Use for keyboard-driven command/search interfaces like Spotlight or VS Code's palette.",
    tags: ["command","search","keyboard","overlay"],
  },

  CommandPalette: {
    description: "Full-featured search and command palette with grouping and actions.",
    categories: ["admin","desktop","search","navigation"],
    behavior: "interactive", type: "overlay", function: "search-palette",
    location: ["overlay"],
    library: "core",
    aliases: ["command palette","search palette","universal search","omnibar","global search"],
    whenToUse: "Use for comprehensive search and command interfaces that search across the entire app.",
    tags: ["search","command","overlay"],
  },

  FloatingDock: {
    description: "Aceternity UI floating dock navigation with magnification hover effects, inspired by macOS dock.",
    categories: ["navigation","desktop","landing page","animated","dock","showcase"],
    behavior: "animated", type: "navigation", function: "floating-nav",
    location: ["footer","overlay"],
    library: "aceternity",
    aliases: [
      "floating dock","floating nav","macOS dock","bottom dock","animated dock",
      "floating navigation bar","dock navigation","macOS-style nav","hovering dock",
      "magnifying dock","icon navigation","floating icon bar"
    ],
    whenToUse: "Use when the user asks for a macOS-style floating dock, animated bottom navigation, or floating icon navigation bar with magnification effects.",
    tags: ["dock","navigation","aceternity","animated","macOS"],
  },

  Button: {
    description: "Interactive button with multiple variants and sizes.",
    categories: ["form","landing page","dashboard","ecommerce","marketing","buttons"],
    behavior: "interactive", type: "input", function: "action-trigger",
    location: ["inline"],
    library: "core",
    aliases: ["button","action button","submit button","CTA button","click button"],
    whenToUse: "Use for any clickable action trigger.",
    tags: ["button","action","interactive"],
  },

  Input: {
    description: "Text input field with label and placeholder.",
    categories: ["form","authentication","search"],
    behavior: "interactive", type: "input", function: "text-input",
    location: ["inline"],
    library: "core",
    aliases: ["text input","input field","text field","form field","input box"],
    whenToUse: "Use for single-line text input in forms, search, or authentication.",
    tags: ["input","field","form"],
  },

  Textarea: {
    description: "Multi-line text input with configurable rows.",
    categories: ["form","chat"],
    behavior: "interactive", type: "input", function: "multiline-input",
    location: ["inline"],
    library: "core",
    aliases: ["textarea","multi-line input","text area","message box","comment box"],
    whenToUse: "Use for multi-line text input like messages, descriptions, or comments.",
    tags: ["textarea","input","form","multiline"],
  },

  Select: {
    description: "Dropdown select input with options list.",
    categories: ["form","dashboard"],
    behavior: "interactive", type: "input", function: "dropdown-select",
    location: ["inline"],
    library: "core",
    aliases: ["dropdown","select","picker","combobox","select box"],
    whenToUse: "Use for selecting from a list of options in forms or filters.",
    tags: ["select","dropdown","form"],
  },

  Checkbox: {
    description: "Checkbox input with label and optional description.",
    categories: ["form","authentication"],
    behavior: "interactive", type: "input", function: "boolean-input",
    location: ["inline"],
    library: "core",
    aliases: ["checkbox","check","tick box","boolean input"],
    whenToUse: "Use for yes/no or multi-select boolean options in forms.",
    tags: ["checkbox","input","form"],
  },

  RadioGroup: {
    description: "Radio button group for single option selection.",
    categories: ["form"],
    behavior: "interactive", type: "input", function: "single-choice",
    location: ["inline"],
    library: "core",
    aliases: ["radio","radio buttons","single select","option group","radio group"],
    whenToUse: "Use for mutually exclusive option selection in forms.",
    tags: ["radio","input","form"],
  },

  Switch: {
    description: "Toggle switch for binary on/off state.",
    categories: ["form","dashboard","admin"],
    behavior: "interactive", type: "input", function: "toggle-switch",
    location: ["inline"],
    library: "core",
    aliases: ["toggle","switch","on/off toggle","enable/disable","feature toggle"],
    whenToUse: "Use for binary on/off settings or feature toggles.",
    tags: ["switch","toggle","input"],
  },

  Slider: {
    description: "Range slider for selecting a numeric value within a range.",
    categories: ["form","dashboard"],
    behavior: "interactive", type: "input", function: "range-input",
    location: ["inline"],
    library: "core",
    aliases: ["slider","range slider","range input","volume control","progress slider"],
    whenToUse: "Use for selecting a numeric value within a defined range.",
    tags: ["slider","range","input"],
  },

  DatePicker: {
    description: "Date selection component with calendar popup.",
    categories: ["form","calendar"],
    behavior: "interactive", type: "input", function: "date-input",
    location: ["overlay","inline"],
    library: "core",
    aliases: ["date picker","calendar picker","date input","date selector","date field"],
    whenToUse: "Use for selecting dates or date ranges in forms.",
    tags: ["datepicker","calendar","input"],
  },

  ColorPicker: {
    description: "Color selection component.",
    categories: ["form"],
    behavior: "interactive", type: "input", function: "color-input",
    location: ["overlay","inline"],
    library: "core",
    aliases: ["color picker","color selector","colour picker","color chooser"],
    whenToUse: "Use for selecting colors in design tools or settings.",
    tags: ["color","picker","input"],
  },

  FileUpload: {
    description: "File upload input with drag-and-drop support.",
    categories: ["form","files"],
    behavior: "interactive", type: "input", function: "file-input",
    location: ["inline"],
    library: "core",
    aliases: ["file upload","drag and drop","file input","upload","file picker","drop zone"],
    whenToUse: "Use for uploading files in forms or media management interfaces.",
    tags: ["upload","file","input"],
  },

  Rating: {
    description: "Star rating input.",
    categories: ["form","ecommerce","social"],
    behavior: "interactive", type: "input", function: "rating-input",
    location: ["inline"],
    library: "core",
    aliases: ["star rating","rating","review stars","score","stars"],
    whenToUse: "Use for star ratings or numeric scoring in reviews or feedback.",
    tags: ["rating","stars","input"],
  },

  NumberInput: {
    description: "Number input with increment/decrement controls.",
    categories: ["form","dashboard"],
    behavior: "interactive", type: "input", function: "number-input",
    location: ["inline"],
    library: "chakra",
    aliases: ["number input","numeric field","quantity input","stepper input","counter input"],
    whenToUse: "Use for numeric input with increment/decrement controls.",
    tags: ["number","input","form"],
  },

  Form: {
    description: "Form container wrapping form fields with validation layout.",
    categories: ["form","authentication"],
    behavior: "interactive", type: "composite", function: "form-container",
    location: ["main-content"],
    library: "core",
    aliases: ["form","registration form","login form","contact form","sign up form"],
    whenToUse: "Use to wrap form fields into a structured form with validation.",
    tags: ["form","container","input"],
    allowedChildren: ["*"],
  },
```

**Step 3: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: add rich metadata to navigation, input components including FloatingDock (batch 3/8)"
```

---

## Task 6: Feedback, Data & Chart Components (28 components)

**Files:**
- Modify: `src/lib/registry/components.ts`

**Components:** Alert, Toast, Banner, Progress, Dialog, Drawer, Popover, ConfirmDialog, Notification, CircularProgress, LineChart, BarChart, AreaChart, PieChart, RadarChart, ScatterChart, DataTable, List, Tree, DescriptionList, Pagination, EmptyState, InfiniteScroll, Gallery, MuiDataGrid, MuiTreeView, MuiPagination, Stat, StatLabel, StatNumber, StatHelpText

```typescript
  Alert: {
    description: "Alert message box with variants: info, warning, error, success.",
    categories: ["dashboard","form","feedback","notifications"],
    behavior: "static", type: "feedback", function: "alert-message",
    location: ["inline","above-fold"],
    library: "core",
    aliases: ["alert","warning message","error message","notification banner","info alert","success message"],
    whenToUse: "Use to display important messages, warnings, or errors inline in the page.",
    tags: ["alert","warning","message","feedback"],
  },

  Toast: {
    description: "Temporary notification that appears and disappears automatically.",
    categories: ["dashboard","feedback","notifications"],
    behavior: "animated", type: "overlay", function: "toast-notification",
    location: ["overlay"],
    library: "core",
    aliases: ["toast","snackbar","notification toast","pop-up notification","temporary alert"],
    whenToUse: "Use for brief notification messages that appear temporarily and disappear automatically.",
    tags: ["toast","notification","overlay"],
  },

  Banner: {
    description: "Prominent announcement banner at the top of a page.",
    categories: ["landing page","dashboard","notifications","feedback"],
    behavior: "static", type: "display", function: "banner-notice",
    location: ["above-fold","header"],
    library: "core",
    aliases: ["banner","announcement banner","info banner","promo banner","top bar notice"],
    whenToUse: "Use for prominent announcements that span the full page width near the top.",
    tags: ["banner","announcement","notification"],
  },

  Progress: {
    description: "Progress bar showing task completion percentage.",
    categories: ["dashboard","form","loading","feedback"],
    behavior: "animated", type: "display", function: "progress-indicator",
    location: ["inline"],
    library: "core",
    aliases: ["progress bar","loading bar","completion bar","progress indicator","percentage bar"],
    whenToUse: "Use to show task progress, upload progress, or completion percentage.",
    tags: ["progress","loading","indicator"],
  },

  Dialog: {
    description: "Modal dialog that overlays the page for focused interactions.",
    categories: ["modals","feedback","ecommerce","form"],
    behavior: "interactive", type: "overlay", function: "modal-dialog",
    location: ["overlay"],
    library: "core",
    aliases: ["dialog","modal","popup","overlay dialog","modal window"],
    whenToUse: "Use for focused interactions requiring user attention before continuing.",
    tags: ["dialog","modal","overlay"],
  },

  Drawer: {
    description: "Slide-in panel that overlays from the edge of the screen.",
    categories: ["modals","mobile","navigation","feedback"],
    behavior: "animated", type: "overlay", function: "slide-drawer",
    location: ["overlay","sidebar"],
    library: "core",
    aliases: ["drawer","slide-over","side panel","off-canvas","sheet","sliding panel"],
    whenToUse: "Use for slide-in panels with additional content or mobile navigation.",
    tags: ["drawer","slide","overlay","mobile"],
  },

  Popover: {
    description: "Contextual popup that appears on click near a trigger element.",
    categories: ["dashboard","navigation","feedback"],
    behavior: "interactive", type: "overlay", function: "popover",
    location: ["overlay"],
    library: "core",
    aliases: ["popover","dropdown menu","context menu","floating panel","tooltip popup"],
    whenToUse: "Use for contextual information or actions that appear on click near a trigger.",
    tags: ["popover","overlay","contextual"],
  },

  ConfirmDialog: {
    description: "Confirmation dialog for destructive or important actions.",
    categories: ["modals","feedback","admin"],
    behavior: "interactive", type: "overlay", function: "confirmation",
    location: ["overlay"],
    library: "core",
    aliases: ["confirm dialog","confirmation dialog","delete confirm","are you sure dialog","warning dialog"],
    whenToUse: "Use to confirm destructive or important actions before proceeding.",
    tags: ["confirm","dialog","modal"],
  },

  Notification: {
    description: "Individual notification item for a notification list or feed.",
    categories: ["dashboard","notifications","social","feedback"],
    behavior: "static", type: "display", function: "notification-item",
    location: ["inline","overlay"],
    library: "core",
    aliases: ["notification","alert item","message notification","inbox item","notification row"],
    whenToUse: "Use for individual notification items in a notification list or feed.",
    tags: ["notification","alert","inbox"],
  },

  CircularProgress: {
    description: "Circular progress indicator showing percentage completion.",
    categories: ["dashboard","loading","feedback","analytics"],
    behavior: "animated", type: "display", function: "circular-indicator",
    location: ["inline"],
    library: "chakra",
    aliases: ["circular progress","ring progress","donut progress","progress circle","radial progress"],
    whenToUse: "Use for circular/ring-style progress indicators.",
    tags: ["progress","circular","loading"],
  },

  LineChart: {
    description: "Line chart for trends over time.",
    categories: ["dashboard","analytics","charts"],
    behavior: "data-driven", type: "chart", function: "trend-chart",
    location: ["main-content"],
    library: "core",
    aliases: ["line chart","trend chart","time series","sparkline","line graph"],
    whenToUse: "Use to show trends over time or continuous data series.",
    tags: ["chart","line","analytics","data"],
  },

  BarChart: {
    description: "Bar chart for comparing values across categories.",
    categories: ["dashboard","analytics","charts"],
    behavior: "data-driven", type: "chart", function: "comparison-chart",
    location: ["main-content"],
    library: "core",
    aliases: ["bar chart","column chart","bar graph","comparison chart","histogram"],
    whenToUse: "Use to compare values across discrete categories.",
    tags: ["chart","bar","comparison","analytics"],
  },

  AreaChart: {
    description: "Area chart for cumulative values or volume over time.",
    categories: ["dashboard","analytics","charts"],
    behavior: "data-driven", type: "chart", function: "area-chart",
    location: ["main-content"],
    library: "core",
    aliases: ["area chart","filled line chart","stacked area","volume chart"],
    whenToUse: "Use for cumulative values or to emphasize volume over time.",
    tags: ["chart","area","analytics"],
  },

  PieChart: {
    description: "Pie/donut chart for proportions of a whole.",
    categories: ["dashboard","analytics","charts"],
    behavior: "data-driven", type: "chart", function: "proportion-chart",
    location: ["main-content"],
    library: "core",
    aliases: ["pie chart","donut chart","proportion chart","percentage chart","circular chart"],
    whenToUse: "Use to show proportions or percentages of a whole.",
    tags: ["chart","pie","proportion"],
  },

  RadarChart: {
    description: "Radar/spider chart for comparing multiple variables.",
    categories: ["dashboard","analytics","charts"],
    behavior: "data-driven", type: "chart", function: "radar-chart",
    location: ["main-content"],
    library: "core",
    aliases: ["radar chart","spider chart","web chart","radial chart","polar chart"],
    whenToUse: "Use to compare multiple variables across categories.",
    tags: ["chart","radar","analytics"],
  },

  ScatterChart: {
    description: "Scatter plot for showing correlation between two variables.",
    categories: ["analytics","charts"],
    behavior: "data-driven", type: "chart", function: "scatter-chart",
    location: ["main-content"],
    library: "core",
    aliases: ["scatter plot","bubble chart","scatter graph","correlation chart","dot plot"],
    whenToUse: "Use to show the correlation between two variables.",
    tags: ["chart","scatter","correlation"],
  },

  DataTable: {
    description: "Sortable, filterable data table with pagination.",
    categories: ["dashboard","admin","data","tables","ecommerce"],
    behavior: "interactive", type: "composite", function: "data-table",
    location: ["main-content"],
    library: "core",
    aliases: ["table","data grid","data table","spreadsheet","tabular data","grid table"],
    whenToUse: "Use for displaying structured data with sorting, filtering, and pagination.",
    tags: ["table","data","grid","sorting"],
  },

  List: {
    description: "Vertical list of items with optional icons and metadata.",
    categories: ["blog","dashboard","data","chat"],
    behavior: "static", type: "composite", function: "list-display",
    location: ["main-content","sidebar"],
    library: "core",
    aliases: ["list","item list","bullet list","ordered list","feed","item feed"],
    whenToUse: "Use for displaying a series of items in a vertical list.",
    tags: ["list","items","display"],
  },

  Tree: {
    description: "Hierarchical tree view with expandable nodes.",
    categories: ["files","admin","data","desktop"],
    behavior: "interactive", type: "composite", function: "tree-view",
    location: ["sidebar","main-content"],
    library: "core",
    aliases: ["tree","file tree","folder tree","hierarchy view","tree view","expandable list","nested list"],
    whenToUse: "Use for hierarchical data like file systems, org charts, or nested categories.",
    tags: ["tree","hierarchy","files"],
  },

  DescriptionList: {
    description: "Key-value pair list for metadata, specs, or details.",
    categories: ["profile","data","ecommerce"],
    behavior: "static", type: "composite", function: "definition-list",
    location: ["main-content"],
    library: "core",
    aliases: ["description list","definition list","key-value list","metadata list","specs list","detail list"],
    whenToUse: "Use for displaying key-value pairs like product specs, user details, or metadata.",
    tags: ["list","definition","key-value"],
  },

  Pagination: {
    description: "Page navigation controls for paginated content.",
    categories: ["blog","ecommerce","data","tables"],
    behavior: "interactive", type: "navigation", function: "page-controls",
    location: ["footer","main-content"],
    library: "core",
    aliases: ["pagination","page controls","load more","next page","page numbers","pager"],
    whenToUse: "Use for navigating between pages of paginated content.",
    tags: ["pagination","navigation","pages"],
  },

  EmptyState: {
    description: "Placeholder shown when a list or table has no data.",
    categories: ["dashboard","data","empty","feedback"],
    behavior: "static", type: "composite", function: "empty-state",
    location: ["main-content"],
    library: "core",
    aliases: ["empty state","no results","zero state","no data","empty placeholder","nothing here"],
    whenToUse: "Use when a list, table, or section has no data to display.",
    tags: ["empty","placeholder","state"],
  },

  InfiniteScroll: {
    description: "Automatically loads more content as the user scrolls down.",
    categories: ["blog","social","scroll","data"],
    behavior: "interactive", type: "composite", function: "infinite-loader",
    location: ["main-content"],
    library: "core",
    aliases: ["infinite scroll","load more on scroll","endless scroll","lazy load list","auto-load"],
    whenToUse: "Use to automatically load more content as the user scrolls down a list or feed.",
    tags: ["infinite","scroll","loading"],
  },

  Gallery: {
    description: "Image gallery grid with lightbox viewer.",
    categories: ["media","ecommerce","portfolio","blog"],
    behavior: "interactive", type: "composite", function: "image-gallery",
    location: ["main-content"],
    library: "core",
    aliases: ["gallery","image gallery","photo gallery","lightbox","portfolio grid","photo grid"],
    whenToUse: "Use for displaying multiple images in a grid with lightbox viewing.",
    tags: ["gallery","images","media"],
  },

  MuiDataGrid: {
    description: "Material UI advanced data grid with enterprise features.",
    categories: ["dashboard","admin","data","tables"],
    behavior: "interactive", type: "composite", function: "advanced-data-grid",
    location: ["main-content"],
    library: "material",
    aliases: ["material data grid","MUI grid","MUI data grid","advanced table","enterprise table"],
    whenToUse: "Use for advanced data grid requirements with Material UI styling.",
    tags: ["table","material","mui","data"],
  },

  MuiTreeView: {
    description: "Material UI tree view component.",
    categories: ["files","admin","data"],
    behavior: "interactive", type: "composite", function: "tree-view",
    location: ["sidebar","main-content"],
    library: "material",
    aliases: ["material tree","MUI tree","MUI tree view","expandable tree"],
    whenToUse: "Use for tree view with Material UI styling.",
    tags: ["tree","material","mui"],
  },

  MuiPagination: {
    description: "Material UI pagination component.",
    categories: ["data","tables"],
    behavior: "interactive", type: "navigation", function: "pagination",
    location: ["footer"],
    library: "material",
    aliases: ["material pagination","MUI pagination","MUI pager"],
    whenToUse: "Use for pagination with Material UI styling.",
    tags: ["pagination","material","mui"],
  },

  Stat: {
    description: "Chakra UI stat component with label, number, and help text.",
    categories: ["dashboard","analytics"],
    behavior: "static", type: "composite", function: "stat-display",
    location: ["inline","main-content"],
    library: "chakra",
    aliases: ["stat","chakra stat","statistic","metric stat"],
    whenToUse: "Use for displaying a statistic with label, value, and help text (Chakra UI style).",
    tags: ["stat","chakra","analytics"],
  },

  StatLabel: {
    description: "Label sub-component of Chakra Stat.",
    categories: ["dashboard","analytics"],
    behavior: "static", type: "display", function: "stat-label",
    location: ["inline"],
    library: "chakra",
    aliases: ["stat label","metric label"],
    whenToUse: "Use as the label text inside a Stat component.",
    tags: ["stat","label","chakra"],
  },

  StatNumber: {
    description: "Number value sub-component of Chakra Stat.",
    categories: ["dashboard","analytics"],
    behavior: "static", type: "display", function: "stat-value",
    location: ["inline"],
    library: "chakra",
    aliases: ["stat number","metric value","stat value"],
    whenToUse: "Use as the main number value inside a Stat component.",
    tags: ["stat","number","chakra"],
  },

  StatHelpText: {
    description: "Help text sub-component of Chakra Stat.",
    categories: ["dashboard","analytics"],
    behavior: "static", type: "display", function: "stat-help",
    location: ["inline"],
    library: "chakra",
    aliases: ["stat help","stat description","metric context","stat change"],
    whenToUse: "Use as supplementary context or trend text inside a Stat component.",
    tags: ["stat","help","chakra"],
  },
```

**Step 3: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: add rich metadata to feedback, data, and chart components (batch 4/8)"
```

---

## Task 7: Aceternity UI Components (17+ components)

**Files:**
- Modify: `src/lib/registry/components.ts`

**Components:** AuroraBackground, WavyBackground, BackgroundBeams, Meteors, Particles, GlowingStars, SparklesCore, TypewriterEffect, TextGenerateEffect, MovingBorder, ThreeDCard, ThreeDCardBody, ThreeDCardItem, HoverEffect, **InfiniteMovingCards**, **BentoGrid**, **BentoGridItem**, FollowingPointer, GlobeComponent

```typescript
  AuroraBackground: {
    description: "Animated aurora borealis background effect.",
    categories: ["landing page","backgrounds","animated","showcase","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "animated-background",
    location: ["full-page","above-fold"],
    library: "aceternity",
    aliases: ["aurora","aurora background","northern lights background","gradient animation background","aurora borealis"],
    whenToUse: "Use as an animated aurora/northern-lights background for hero sections.",
    tags: ["background","aurora","animated","aceternity"],
    allowedChildren: ["*"],
  },

  WavyBackground: {
    description: "Animated wavy pattern background.",
    categories: ["landing page","backgrounds","animated","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "wavy-background",
    location: ["full-page","above-fold"],
    library: "aceternity",
    aliases: ["wavy background","wave background","wave animation background","animated waves"],
    whenToUse: "Use as an animated wave pattern background for sections.",
    tags: ["background","waves","animated","aceternity"],
    allowedChildren: ["*"],
  },

  BackgroundBeams: {
    description: "Animated light beam background effect.",
    categories: ["landing page","backgrounds","animated","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "beam-background",
    location: ["full-page","above-fold"],
    library: "aceternity",
    aliases: ["background beams","laser beams background","light beams","beam animation","light rays"],
    whenToUse: "Use as an animated light beam/laser background effect for dark hero sections.",
    tags: ["background","beams","animated","aceternity"],
    allowedChildren: ["*"],
  },

  Meteors: {
    description: "Animated falling meteors/shooting stars effect.",
    categories: ["landing page","backgrounds","animated","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "meteor-effect",
    location: ["full-page","main-content"],
    library: "aceternity",
    aliases: ["meteors","falling stars","meteor shower","shooting stars","particle rain"],
    whenToUse: "Use for animated meteor/shooting star effects on dark background sections.",
    tags: ["background","meteors","animated","aceternity"],
  },

  Particles: {
    description: "Animated floating particles background.",
    categories: ["landing page","backgrounds","animated","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "particle-background",
    location: ["full-page","main-content"],
    library: "aceternity",
    aliases: ["particles","floating particles","dot particles","interactive particles","particle field"],
    whenToUse: "Use for animated floating particle backgrounds.",
    tags: ["background","particles","animated","aceternity"],
    allowedChildren: ["*"],
  },

  GlowingStars: {
    description: "Animated glowing starfield background.",
    categories: ["landing page","backgrounds","animated","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "star-background",
    location: ["full-page","main-content"],
    library: "aceternity",
    aliases: ["glowing stars","starfield","night sky","twinkling stars","star background"],
    whenToUse: "Use for a glowing stars/starfield animated background on dark sections.",
    tags: ["background","stars","animated","aceternity"],
    allowedChildren: ["*"],
  },

  SparklesCore: {
    description: "Sparkle particle effect overlaid on content.",
    categories: ["landing page","backgrounds","animated"],
    behavior: "animated", type: "effect", function: "sparkle-effect",
    location: ["inline","main-content"],
    library: "aceternity",
    aliases: ["sparkles","sparkle effect","glitter","particle sparkles","magic sparkles"],
    whenToUse: "Use to add sparkle/glitter particle effects to text or section backgrounds.",
    tags: ["sparkles","particles","animated","aceternity"],
    allowedChildren: ["*"],
  },

  TypewriterEffect: {
    description: "Animated typewriter text effect with cursor.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "typewriter-text",
    location: ["above-fold","inline"],
    library: "aceternity",
    aliases: ["typewriter","typing effect","typewriter animation","text typing","word by word typing"],
    whenToUse: "Use for animated typewriter text effects in hero headlines.",
    tags: ["text","typewriter","animated","aceternity"],
  },

  TextGenerateEffect: {
    description: "Word-by-word text reveal animation.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "text-reveal",
    location: ["above-fold","inline"],
    library: "aceternity",
    aliases: ["text generate","word reveal","text animation","word by word reveal","fade in words","text reveal animation"],
    whenToUse: "Use for word-by-word text reveal animations in hero headlines.",
    tags: ["text","reveal","animated","aceternity"],
  },

  MovingBorder: {
    description: "Animated rotating gradient border effect for any element.",
    categories: ["landing page","animated","buttons","cards"],
    behavior: "animated", type: "effect", function: "animated-border",
    location: ["inline"],
    library: "aceternity",
    aliases: ["moving border","animated border","rotating border","gradient border","spinning border"],
    whenToUse: "Use to add an animated moving/rotating gradient border to buttons, cards, or sections.",
    tags: ["border","animated","gradient","aceternity"],
  },

  ThreeDCard: {
    description: "3D card with mouse-tracking tilt/parallax effect.",
    categories: ["landing page","3d","cards","animated","hover"],
    behavior: "animated", type: "composite", function: "3d-card",
    location: ["main-content"],
    library: "aceternity",
    aliases: ["3D card","tilt card","3D effect card","perspective card","mouse tilt card","hover 3D card"],
    whenToUse: "Use for cards with 3D tilt/parallax mouse-tracking hover effects.",
    tags: ["card","3d","tilt","animated","aceternity"],
    allowedChildren: ["ThreeDCardBody"],
  },

  ThreeDCardBody: {
    description: "Body wrapper inside a ThreeDCard.",
    categories: ["3d","cards"],
    behavior: "animated", type: "layout", function: "3d-card-body",
    location: ["inline"],
    library: "aceternity",
    aliases: ["3D card body","card body 3D","ThreeDCard body wrapper"],
    whenToUse: "Use as the body wrapper inside a ThreeDCard component.",
    tags: ["card","3d","aceternity"],
    allowedChildren: ["ThreeDCardItem","*"],
  },

  ThreeDCardItem: {
    description: "Item with depth transform inside a ThreeDCard.",
    categories: ["3d","cards"],
    behavior: "animated", type: "display", function: "3d-card-item",
    location: ["inline"],
    library: "aceternity",
    aliases: ["3D card item","card depth item","parallax card item"],
    whenToUse: "Use as an individual item with depth/transform inside a ThreeDCard.",
    tags: ["card","3d","depth","aceternity"],
  },

  HoverEffect: {
    description: "Grid of cards that reveal animated content on hover.",
    categories: ["landing page","cards","hover","animated","showcase"],
    behavior: "animated", type: "composite", function: "hover-card-grid",
    location: ["main-content"],
    library: "aceternity",
    aliases: ["hover effect","card hover grid","hover animation cards","hover reveal cards","animated card hover"],
    whenToUse: "Use for a grid of cards that reveal content with animation on hover.",
    tags: ["hover","cards","animated","aceternity"],
  },

  InfiniteMovingCards: {
    description: "Infinitely auto-scrolling carousel of cards (testimonials, logos, reviews).",
    categories: ["landing page","animated","carousel","testimonials","showcase"],
    behavior: "animated", type: "composite", function: "infinite-carousel",
    location: ["main-content"],
    library: "aceternity",
    aliases: [
      "infinite moving cards","infinite carousel","scrolling cards","marquee cards",
      "testimonial carousel","infinite testimonials","auto-scroll cards","looping cards",
      "sliding testimonials","continuous scroll cards","infinite scroll carousel"
    ],
    whenToUse: "Use for infinitely auto-scrolling testimonials, reviews, logos, or cards that loop continuously.",
    tags: ["carousel","infinite","animated","testimonials","aceternity"],
  },

  BentoGrid: {
    description: "Aceternity UI bento grid — an asymmetric, mosaic-style card grid with varied cell sizes.",
    categories: ["dashboard","landing page","cards","showcase","media","portfolio"],
    behavior: "static", type: "layout", function: "bento-layout",
    location: ["main-content","above-fold"],
    library: "aceternity",
    aliases: [
      "bento grid","bento layout","bento","mosaic grid","asymmetric grid",
      "feature bento","bento box layout","variable grid","mixed-size grid","unequal grid"
    ],
    whenToUse: "Use when the user asks for a bento grid, mosaic layout, asymmetric card grid, or feature showcase with varied-size cards.",
    tags: ["bento","grid","layout","asymmetric","aceternity"],
    allowedChildren: ["BentoGridItem"],
  },

  BentoGridItem: {
    description: "Individual cell/card inside a BentoGrid.",
    categories: ["dashboard","landing page","cards","showcase"],
    behavior: "static", type: "composite", function: "bento-cell",
    location: ["inline"],
    library: "aceternity",
    aliases: ["bento item","bento card","bento cell","bento grid item","bento tile"],
    whenToUse: "Use as individual items/cells within a BentoGrid component.",
    tags: ["bento","card","aceternity"],
  },

  FollowingPointer: {
    description: "Custom cursor follower effect for cards.",
    categories: ["landing page","animated","hover"],
    behavior: "animated", type: "effect", function: "cursor-effect",
    location: ["inline"],
    library: "aceternity",
    aliases: ["following pointer","cursor follower","custom cursor","pointer effect","mouse follower"],
    whenToUse: "Use to add a custom cursor/pointer following effect to a card or section.",
    tags: ["cursor","hover","animated","aceternity"],
    allowedChildren: ["*"],
  },

  GlobeComponent: {
    description: "Interactive 3D globe visualization.",
    categories: ["landing page","3d","showcase","widgets"],
    behavior: "animated", type: "display", function: "globe-visualization",
    location: ["main-content","above-fold"],
    library: "aceternity",
    aliases: ["globe","3D globe","interactive globe","world map","earth visualization","3D world"],
    whenToUse: "Use for showing a 3D interactive globe, e.g. for showing worldwide reach or global presence.",
    tags: ["globe","3d","visualization","aceternity"],
  },
```

**Step 3: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: add rich metadata to Aceternity UI components including BentoGrid, InfiniteMovingCards (batch 5/8)"
```

---

## Task 8: Magic UI Components (18 components)

**Files:**
- Modify: `src/lib/registry/components.ts`

**Components:** AnimatedGradient, BlurFade, BorderBeam, ShimmerButton, NumberTicker, WordPullUp, Marquee, OrbitingCircles, SparklesText, PulsatingButton, MagicAnimatedBeam, FlipText, TextShimmer, RetroGrid, DotPattern, GridPattern, Ripple, MagicCard

```typescript
  AnimatedGradient: {
    description: "Animated gradient background with color shifts.",
    categories: ["landing page","backgrounds","animated","gradient","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "gradient-animation",
    location: ["full-page","inline"],
    library: "magic-ui",
    aliases: ["animated gradient","gradient animation","color shift background","mesh gradient","flowing gradient"],
    whenToUse: "Use for animated gradient backgrounds or text gradient effects.",
    tags: ["gradient","animated","background","magic-ui"],
    allowedChildren: ["*"],
  },

  BlurFade: {
    description: "Blur-to-focus fade-in animation for any element.",
    categories: ["landing page","animated","text"],
    behavior: "animated", type: "effect", function: "blur-fade-in",
    location: ["inline"],
    library: "magic-ui",
    aliases: ["blur fade","fade in","blur reveal","scroll reveal","fade animation","blur to focus"],
    whenToUse: "Use to animate elements in with a blur-to-focus fade effect on scroll.",
    tags: ["animation","blur","fade","magic-ui"],
    allowedChildren: ["*"],
  },

  BorderBeam: {
    description: "Animated scanning beam border effect for cards.",
    categories: ["landing page","animated","cards"],
    behavior: "animated", type: "effect", function: "border-beam",
    location: ["inline"],
    library: "magic-ui",
    aliases: ["border beam","animated border","glowing border","scanning border","light border"],
    whenToUse: "Use to add an animated beam/scanning border effect to cards or containers.",
    tags: ["border","beam","animated","magic-ui"],
  },

  ShimmerButton: {
    description: "CTA button with shimmer animation effect.",
    categories: ["landing page","buttons","animated","marketing"],
    behavior: "animated", type: "input", function: "shimmer-cta",
    location: ["inline"],
    library: "magic-ui",
    aliases: ["shimmer button","animated button","glowing CTA","shimmer CTA","shiny button"],
    whenToUse: "Use for eye-catching CTA buttons with a shimmer/gloss animation.",
    tags: ["button","shimmer","animated","magic-ui"],
  },

  NumberTicker: {
    description: "Number that animates counting up to its final value.",
    categories: ["dashboard","landing page","analytics","animated"],
    behavior: "animated", type: "display", function: "count-up-number",
    location: ["inline","above-fold"],
    library: "magic-ui",
    aliases: ["number ticker","count up","animated counter","number counter","counting animation","rolling number"],
    whenToUse: "Use for numbers that animate counting up to their value when they enter the viewport.",
    tags: ["number","counter","animated","magic-ui"],
  },

  WordPullUp: {
    description: "Word-by-word pull-up text reveal animation.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "word-pull-up",
    location: ["above-fold","inline"],
    library: "magic-ui",
    aliases: ["word pull up","text reveal","word animation","pull up text","staggered word reveal","words slide in"],
    whenToUse: "Use for word-by-word pull-up text reveal animations in headlines.",
    tags: ["text","animation","reveal","magic-ui"],
  },

  Marquee: {
    description: "Horizontally scrolling marquee for logos, cards, or text.",
    categories: ["landing page","animated","carousel","showcase"],
    behavior: "animated", type: "composite", function: "marquee-scroll",
    location: ["main-content"],
    library: "magic-ui",
    aliases: ["marquee","scrolling ticker","brand scroll","logo marquee","horizontal scroll","auto-scroll row"],
    whenToUse: "Use for horizontally scrolling content like logo clouds, testimonials, or feature highlights.",
    tags: ["marquee","scroll","animated","magic-ui"],
  },

  OrbitingCircles: {
    description: "Concentric orbiting circles animation, ideal for tech stack visualization.",
    categories: ["landing page","animated","showcase"],
    behavior: "animated", type: "display", function: "orbit-animation",
    location: ["main-content","above-fold"],
    library: "magic-ui",
    aliases: ["orbiting circles","orbit animation","planet orbit","spinning orbit","tech orbit","integration icons"],
    whenToUse: "Use for orbiting circles animation showing tech stack, integrations, or ecosystem.",
    tags: ["orbit","animation","circles","magic-ui"],
  },

  SparklesText: {
    description: "Text with sparkle/glitter animation effect.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "sparkle-text",
    location: ["inline","above-fold"],
    library: "magic-ui",
    aliases: ["sparkles text","sparkle text","glitter text","animated sparkle headline","magic text"],
    whenToUse: "Use to add sparkle animation effects to heading or highlight text.",
    tags: ["text","sparkles","animated","magic-ui"],
  },

  PulsatingButton: {
    description: "CTA button with continuous pulsating ring animation.",
    categories: ["landing page","buttons","animated","marketing"],
    behavior: "animated", type: "input", function: "pulsating-cta",
    location: ["inline"],
    library: "magic-ui",
    aliases: ["pulsating button","pulse button","glowing pulse CTA","animated pulse button","ring pulse button"],
    whenToUse: "Use for attention-grabbing CTA buttons with a pulsating ring animation.",
    tags: ["button","pulse","animated","magic-ui"],
  },

  MagicAnimatedBeam: {
    description: "Animated beam/line connecting two elements to show flow.",
    categories: ["landing page","animated","showcase"],
    behavior: "animated", type: "effect", function: "animated-beam",
    location: ["main-content"],
    library: "magic-ui",
    aliases: ["animated beam","connection beam","flow beam","magic beam","connecting line","flow animation"],
    whenToUse: "Use to animate beam/connection lines between elements to show data flow or relationships.",
    tags: ["beam","animation","connection","magic-ui"],
  },

  FlipText: {
    description: "Text that flips/rotates between multiple words.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "flip-text",
    location: ["inline","above-fold"],
    library: "magic-ui",
    aliases: ["flip text","rotating words","text rotator","word flip","changing text","alternating words"],
    whenToUse: "Use for text that flips/rotates between multiple words in a hero headline.",
    tags: ["text","flip","animated","magic-ui"],
  },

  TextShimmer: {
    description: "Shimmering/metallic text animation.",
    categories: ["landing page","text","animated","gradient"],
    behavior: "animated", type: "display", function: "shimmer-text",
    location: ["inline"],
    library: "magic-ui",
    aliases: ["text shimmer","shimmering text","metallic text","chrome text","glossy text"],
    whenToUse: "Use for shimmering/metallic text animation effects on dark backgrounds.",
    tags: ["text","shimmer","animated","magic-ui"],
  },

  RetroGrid: {
    description: "Retro/synthwave-style perspective grid background.",
    categories: ["landing page","backgrounds","3d","backgrounds-animated"],
    behavior: "static", type: "effect", function: "retro-grid-bg",
    location: ["full-page","above-fold"],
    library: "magic-ui",
    aliases: ["retro grid","80s grid","perspective grid","neon grid","synthwave grid","tron grid"],
    whenToUse: "Use as a retro/synthwave-style perspective grid background.",
    tags: ["background","retro","grid","magic-ui"],
  },

  DotPattern: {
    description: "Subtle dotted grid pattern background.",
    categories: ["backgrounds","landing page"],
    behavior: "static", type: "effect", function: "dot-background",
    location: ["full-page","main-content"],
    library: "magic-ui",
    aliases: ["dot pattern","dotted background","polka dots","grid dots","dot grid"],
    whenToUse: "Use as a subtle dotted pattern background for sections.",
    tags: ["background","dots","pattern","magic-ui"],
  },

  GridPattern: {
    description: "Subtle grid/graph-paper pattern background.",
    categories: ["backgrounds","landing page"],
    behavior: "static", type: "effect", function: "grid-background",
    location: ["full-page","main-content"],
    library: "magic-ui",
    aliases: ["grid pattern","grid background","graph paper","lined background","grid lines"],
    whenToUse: "Use as a subtle grid/graph-paper background pattern for sections.",
    tags: ["background","grid","pattern","magic-ui"],
  },

  Ripple: {
    description: "Expanding concentric ring/ripple animated background.",
    categories: ["backgrounds","landing page","animated","backgrounds-animated"],
    behavior: "animated", type: "effect", function: "ripple-effect",
    location: ["full-page","main-content"],
    library: "magic-ui",
    aliases: ["ripple","ripple effect","ring animation","expanding rings","concentric rings","pulse rings"],
    whenToUse: "Use for expanding ring/ripple animated backgrounds.",
    tags: ["ripple","animation","background","magic-ui"],
    allowedChildren: ["*"],
  },

  MagicCard: {
    description: "Card with gradient spotlight and hover effects.",
    categories: ["landing page","cards","hover","3d","animated","showcase"],
    behavior: "animated", type: "composite", function: "magic-hover-card",
    location: ["main-content"],
    library: "magic-ui",
    aliases: ["magic card","gradient hover card","spotlight card","tilt hover card","glow card"],
    whenToUse: "Use for cards with gradient/spotlight hover effects.",
    tags: ["card","gradient","hover","magic-ui"],
    allowedChildren: ["*"],
  },
```

**Step 3: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: add rich metadata to Magic UI components (batch 6/8)"
```

---

## Task 9: React Bits & Remaining Components (20+ components)

**Files:**
- Modify: `src/lib/registry/components.ts`

**Components:** NeonButton, GradientText, ShinyButton, TiltCard, ParallaxCard, GlitchText, MorphingText, RevealText, CountUp, TypeWriter, AnimatedInput, RippleButton, MagneticButton, FloatingLabel, GradientHeading, AnimatedBorder, GlassmorphismCard, MuiBreadcrumbs, MuiStepper, MuiAutocomplete, MuiRating, Team, Comparison, Weather, Calendar, MusicPlayer, VideoPlayer, Map, Terminal, Chat

```typescript
  NeonButton: {
    description: "Neon-styled glowing button.",
    categories: ["landing page","buttons","neon","animated"],
    behavior: "animated", type: "input", function: "neon-cta",
    location: ["inline"],
    library: "react-bits",
    aliases: ["neon button","glowing button","neon CTA","cyberpunk button","electric button"],
    whenToUse: "Use for neon-styled glowing CTA buttons in dark or cyberpunk-themed pages.",
    tags: ["button","neon","animated","react-bits"],
  },

  GradientText: {
    description: "Text with gradient color fill.",
    categories: ["landing page","text","gradient"],
    behavior: "static", type: "display", function: "gradient-text",
    location: ["inline","above-fold"],
    library: "react-bits",
    aliases: ["gradient text","colorful text","rainbow text","color gradient text","multicolor text"],
    whenToUse: "Use for text with a gradient color fill.",
    tags: ["text","gradient","react-bits"],
  },

  ShinyButton: {
    description: "Button with shiny/metallic animated effect.",
    categories: ["landing page","buttons","animated"],
    behavior: "animated", type: "input", function: "shiny-cta",
    location: ["inline"],
    library: "react-bits",
    aliases: ["shiny button","glossy button","chrome button","metallic button","reflective button"],
    whenToUse: "Use for buttons with a shiny/metallic animated effect.",
    tags: ["button","shiny","animated","react-bits"],
  },

  TiltCard: {
    description: "Card with 3D tilt effect on mouse hover.",
    categories: ["landing page","cards","3d","hover"],
    behavior: "animated", type: "composite", function: "tilt-card",
    location: ["main-content"],
    library: "react-bits",
    aliases: ["tilt card","gyroscope card","parallax card","hover tilt card","3D tilt"],
    whenToUse: "Use for cards with a 3D tilt effect on mouse hover.",
    tags: ["card","tilt","3d","react-bits"],
  },

  ParallaxCard: {
    description: "Card with layered parallax depth effect on hover.",
    categories: ["landing page","cards","3d","hover","animated"],
    behavior: "animated", type: "composite", function: "parallax-card",
    location: ["main-content"],
    library: "react-bits",
    aliases: ["parallax card","depth card","3D parallax","layered card","depth hover card"],
    whenToUse: "Use for cards with a parallax depth/layer effect on hover.",
    tags: ["card","parallax","3d","react-bits"],
  },

  GlitchText: {
    description: "Text with glitch/corruption animation effect.",
    categories: ["landing page","text","animated","neon"],
    behavior: "animated", type: "display", function: "glitch-text",
    location: ["inline","above-fold"],
    library: "react-bits",
    aliases: ["glitch text","glitch effect","cyberpunk text","corrupted text","digital glitch"],
    whenToUse: "Use for glitch-effect animated text in dark/cyberpunk themed pages.",
    tags: ["text","glitch","animated","react-bits"],
  },

  MorphingText: {
    description: "Text that morphs/transitions between different words.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "morphing-text",
    location: ["above-fold","inline"],
    library: "react-bits",
    aliases: ["morphing text","shape shifting text","text morph","blob text","word transition"],
    whenToUse: "Use for text that morphs/transforms between different words.",
    tags: ["text","morph","animated","react-bits"],
  },

  RevealText: {
    description: "Text that reveals itself with a mask/clip animation.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "reveal-text",
    location: ["inline"],
    library: "react-bits",
    aliases: ["reveal text","text reveal","mask reveal","clip reveal","text unveil"],
    whenToUse: "Use for text that reveals itself with a clipping mask animation.",
    tags: ["text","reveal","animated","react-bits"],
  },

  CountUp: {
    description: "Number that animates counting up to its value on scroll.",
    categories: ["landing page","dashboard","analytics","animated"],
    behavior: "animated", type: "display", function: "count-up",
    location: ["inline","above-fold"],
    library: "react-bits",
    aliases: ["count up","counter","number animation","animated number","counting up","number reveal"],
    whenToUse: "Use for numbers that animate counting up to their value on scroll.",
    tags: ["number","counter","animated","react-bits"],
  },

  TypeWriter: {
    description: "Typewriter text animation.",
    categories: ["landing page","text","animated"],
    behavior: "animated", type: "display", function: "typewriter",
    location: ["above-fold","inline"],
    library: "react-bits",
    aliases: ["typewriter","typing effect","type animation","typing text","character by character"],
    whenToUse: "Use for typewriter character-by-character text animation effects.",
    tags: ["text","typewriter","animated","react-bits"],
  },

  AnimatedInput: {
    description: "Form input with animated label/border effects.",
    categories: ["form","animated"],
    behavior: "animated", type: "input", function: "animated-form-field",
    location: ["inline"],
    library: "react-bits",
    aliases: ["animated input","floating label input","fancy input","material input","animated form field"],
    whenToUse: "Use for form inputs with animated label or border effects.",
    tags: ["input","animated","form","react-bits"],
  },

  RippleButton: {
    description: "Button with material-style ripple click animation.",
    categories: ["buttons","animated","form"],
    behavior: "animated", type: "input", function: "ripple-cta",
    location: ["inline"],
    library: "react-bits",
    aliases: ["ripple button","material button","click ripple","wave button","material click"],
    whenToUse: "Use for buttons with a material-style ripple click animation.",
    tags: ["button","ripple","animated","react-bits"],
  },

  MagneticButton: {
    description: "Button with magnetic cursor-tracking hover effect.",
    categories: ["landing page","buttons","animated","hover"],
    behavior: "animated", type: "input", function: "magnetic-cta",
    location: ["inline"],
    library: "react-bits",
    aliases: ["magnetic button","gravity button","hovering button","magnet button","cursor magnet"],
    whenToUse: "Use for buttons with a magnetic cursor-tracking hover effect.",
    tags: ["button","magnetic","hover","react-bits"],
  },

  FloatingLabel: {
    description: "Form input with animated floating label.",
    categories: ["form","animated"],
    behavior: "animated", type: "input", function: "floating-label",
    location: ["inline"],
    library: "react-bits",
    aliases: ["floating label","animated label","material input","label animation","float label input"],
    whenToUse: "Use for form inputs with animated floating labels that move on focus.",
    tags: ["input","label","animated","react-bits"],
  },

  GradientHeading: {
    description: "Heading with gradient color fill.",
    categories: ["landing page","text","gradient"],
    behavior: "static", type: "display", function: "gradient-headline",
    location: ["above-fold","inline"],
    library: "react-bits",
    aliases: ["gradient heading","gradient title","colorful heading","rainbow heading","gradient h1"],
    whenToUse: "Use for headings with a gradient color fill.",
    tags: ["heading","gradient","react-bits"],
  },

  AnimatedBorder: {
    description: "Animated gradient border around any element.",
    categories: ["landing page","animated","cards"],
    behavior: "animated", type: "effect", function: "animated-border",
    location: ["inline"],
    library: "react-bits",
    aliases: ["animated border","glowing border","gradient border animation","neon border"],
    whenToUse: "Use to add animated gradient borders to cards or sections.",
    tags: ["border","animated","gradient","react-bits"],
  },

  GlassmorphismCard: {
    description: "Card with frosted glass/glassmorphism visual effect.",
    categories: ["landing page","cards","glassmorphism"],
    behavior: "static", type: "composite", function: "glass-card",
    location: ["main-content"],
    library: "react-bits",
    aliases: ["glass card","glassmorphism","frosted glass card","blurred glass card","translucent card"],
    whenToUse: "Use for cards with a frosted glass/glassmorphism backdrop-blur effect.",
    tags: ["card","glassmorphism","frosted","react-bits"],
  },

  MuiBreadcrumbs: {
    description: "Material UI breadcrumb navigation.",
    categories: ["navigation","admin","blog"],
    behavior: "static", type: "navigation", function: "breadcrumbs",
    location: ["header","main-content"],
    library: "material",
    aliases: ["MUI breadcrumbs","material breadcrumbs","breadcrumb trail","material navigation"],
    whenToUse: "Use for breadcrumb navigation with Material UI styling.",
    tags: ["breadcrumb","navigation","material"],
  },

  MuiStepper: {
    description: "Material UI multi-step process indicator.",
    categories: ["form","navigation"],
    behavior: "interactive", type: "navigation", function: "step-indicator",
    location: ["above-fold","main-content"],
    library: "material",
    aliases: ["MUI stepper","material stepper","step wizard","material step indicator"],
    whenToUse: "Use for multi-step process indicators with Material UI styling.",
    tags: ["stepper","material","form"],
  },

  MuiAutocomplete: {
    description: "Material UI autocomplete input with suggestions.",
    categories: ["form","search"],
    behavior: "interactive", type: "input", function: "autocomplete",
    location: ["inline"],
    library: "material",
    aliases: ["MUI autocomplete","material autocomplete","typeahead","autocomplete search","suggestion input"],
    whenToUse: "Use for autocomplete input with suggestions, Material UI styled.",
    tags: ["input","autocomplete","material"],
  },

  MuiRating: {
    description: "Material UI star rating input.",
    categories: ["form","ecommerce","social"],
    behavior: "interactive", type: "input", function: "rating",
    location: ["inline"],
    library: "material",
    aliases: ["MUI rating","material rating","material stars","star rating"],
    whenToUse: "Use for star rating input with Material UI styling.",
    tags: ["rating","stars","material"],
  },

  Weather: {
    description: "Weather widget showing current conditions and forecast.",
    categories: ["widgets","dashboard"],
    behavior: "data-driven", type: "composite", function: "weather-widget",
    location: ["main-content","sidebar"],
    library: "core",
    aliases: ["weather","weather widget","temperature","forecast","current weather"],
    whenToUse: "Use to display current weather conditions or forecast.",
    tags: ["weather","widget","data"],
  },

  Calendar: {
    description: "Full calendar view with events.",
    categories: ["calendar","dashboard","widgets"],
    behavior: "interactive", type: "composite", function: "calendar-view",
    location: ["main-content"],
    library: "core",
    aliases: ["calendar","date calendar","monthly view","event calendar","schedule"],
    whenToUse: "Use for a full calendar view with event display.",
    tags: ["calendar","events","schedule"],
  },

  MusicPlayer: {
    description: "Audio/music player widget.",
    categories: ["widgets","media"],
    behavior: "interactive", type: "composite", function: "audio-player",
    location: ["main-content","sidebar"],
    library: "core",
    aliases: ["music player","audio player","media player","song player"],
    whenToUse: "Use to embed an audio/music player.",
    tags: ["music","audio","player","widget"],
  },

  VideoPlayer: {
    description: "Video player widget.",
    categories: ["widgets","media"],
    behavior: "interactive", type: "composite", function: "video-player",
    location: ["main-content"],
    library: "core",
    aliases: ["video player","video embed","media player","video widget"],
    whenToUse: "Use to embed a video player.",
    tags: ["video","player","media","widget"],
  },

  Map: {
    description: "Interactive map display.",
    categories: ["widgets","landing page"],
    behavior: "interactive", type: "composite", function: "map-display",
    location: ["main-content"],
    library: "core",
    aliases: ["map","location map","Google Maps embed","interactive map","location display"],
    whenToUse: "Use to display an interactive location map.",
    tags: ["map","location","widget"],
  },

  Terminal: {
    description: "Terminal/CLI interface simulator.",
    categories: ["widgets","files","desktop"],
    behavior: "interactive", type: "composite", function: "terminal-emulator",
    location: ["main-content"],
    library: "core",
    aliases: ["terminal","CLI","command prompt","code terminal","shell","console"],
    whenToUse: "Use to display or simulate a terminal/CLI interface.",
    tags: ["terminal","cli","code","widget"],
  },

  Chat: {
    description: "Chat/messaging interface.",
    categories: ["chat","social","widgets"],
    behavior: "interactive", type: "composite", function: "chat-interface",
    location: ["main-content","overlay"],
    library: "core",
    aliases: ["chat","messaging","chatbox","conversation","live chat","message interface"],
    whenToUse: "Use for chat or messaging interfaces.",
    tags: ["chat","messaging","social"],
    allowedChildren: ["*"],
  },
```

**Step 3: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: add rich metadata to React Bits, Material UI, widget components (batch 7/8)"
```

---

## Task 10: Any Remaining Components (Spacer, Divider, Markdown, Tag, Tooltip, etc.)

**Files:**
- Modify: `src/lib/registry/components.ts`

Search for any components still missing the new fields:

```bash
npx tsc --noEmit 2>&1 | grep "Property.*missing" | sort | uniq
```

For any remaining component (Spacer, Divider, Markdown, Tag, Tooltip, InfiniteScroll, and any others flagged), add metadata following the same pattern:

**Spacer:**
```typescript
  Spacer: {
    description: "Adds empty spacing between elements.",
    categories: ["dashboard","landing page"],
    behavior: "static", type: "layout", function: "spacing",
    location: ["inline"],
    library: "core",
    aliases: ["spacer","space","gap","empty space","whitespace"],
    whenToUse: "Use to add explicit empty space between elements.",
    tags: ["layout","spacing","gap"],
  },
```

**Divider:**
```typescript
  Divider: {
    description: "Visual divider line between content.",
    categories: ["dashboard","blog","form"],
    behavior: "static", type: "display", function: "visual-divider",
    location: ["inline"],
    library: "core",
    aliases: ["divider","horizontal rule","hr","line","separator line"],
    whenToUse: "Use to visually divide content sections.",
    tags: ["divider","separator","line"],
  },
```

**Markdown:**
```typescript
  Markdown: {
    description: "Renders markdown content with full formatting.",
    categories: ["blog","files","text"],
    behavior: "static", type: "display", function: "markdown-renderer",
    location: ["main-content"],
    library: "core",
    aliases: ["markdown","rich text","formatted content","MDX","documentation text"],
    whenToUse: "Use to render markdown content like blog posts, documentation, or help articles.",
    tags: ["markdown","text","content"],
  },
```

**Tag (Chakra):**
```typescript
  Tag: {
    description: "Tag label component for categorization.",
    categories: ["blog","ecommerce","social","search"],
    behavior: "static", type: "display", function: "content-tag",
    location: ["inline"],
    library: "chakra",
    aliases: ["tag","chip","category tag","label chip","keyword tag"],
    whenToUse: "Use for content categorization tags in blogs, products, or search results.",
    tags: ["tag","label","chakra"],
  },
```

**Tooltip:**
```typescript
  Tooltip: {
    description: "Contextual information shown on hover.",
    categories: ["dashboard","form","navigation"],
    behavior: "interactive", type: "overlay", function: "contextual-info",
    location: ["overlay"],
    library: "core",
    aliases: ["tooltip","hint","hover tip","info tooltip"],
    whenToUse: "Use to show additional information on hover without cluttering the interface.",
    tags: ["tooltip","hover","overlay"],
  },
```

**Step 3: Verify zero TypeScript errors from missing fields**

```bash
npx tsc --noEmit 2>&1 | grep "missing" | wc -l
```

Expected: 0

**Step 4: Commit**

```bash
git add src/lib/registry/components.ts
git commit -m "feat: complete rich metadata for all remaining components (batch 8/8)"
```

---

## Task 11: Add `getComponentsForCategory` Derived from Registry

**Files:**
- Modify: `src/lib/registry/category-mappings.ts`
- Modify: `src/lib/registry/index.ts`

This replaces the manually-maintained `categoryMappings` object with a function that derives the list from the registry.

**Step 1: Add a `getComponentsByCategory` function to registry/index.ts**

Read `src/lib/registry/index.ts` first to see what it currently exports.

Then add:

```typescript
import { componentRegistry } from "./components";
import type { IntentCategory } from "@/types";

/**
 * Returns all component names that belong to a given intent category.
 * Derived dynamically from the component registry — never goes stale.
 */
export function getComponentNamesByIntentCategory(category: IntentCategory): string[] {
  return Object.entries(componentRegistry)
    .filter(([_, meta]) => meta.categories.includes(category))
    .map(([name]) => name);
}

/**
 * Returns all component names belonging to any of the given intent categories.
 * Deduplicates automatically.
 */
export function getComponentNamesByIntentCategories(categories: IntentCategory[]): string[] {
  const result = new Set<string>();
  // Always include core layout components
  ["Flex", "Grid", "Container", "Section", "Stack", "Center"].forEach(c => result.add(c));
  categories.forEach(cat => {
    getComponentNamesByIntentCategory(cat).forEach(c => result.add(c));
  });
  return Array.from(result);
}
```

**Step 2: Update `category-mappings.ts` to export the derived version**

At the bottom of `category-mappings.ts`, add this after the existing `categoryMappings` object:

```typescript
import { getComponentNamesByIntentCategory, getComponentNamesByIntentCategories } from "./index";

/**
 * Get components for a category — derived from the registry.
 * This replaces the manual list lookup.
 */
export function getComponentsForCategoryDerived(category: CategoryKey): string[] {
  return getComponentNamesByIntentCategory(category as IntentCategory);
}

/**
 * Get components for multiple categories — derived from the registry.
 */
export function getComponentsForCategoriesDerived(categories: CategoryKey[]): string[] {
  return getComponentNamesByIntentCategories(categories as IntentCategory[]);
}
```

**Step 3: Update `component-selection.ts` to use the derived function**

In `src/lib/generation/component-selection.ts`, change the import and call:

```typescript
// Replace this import:
import { getComponentsForCategories, type CategoryKey } from "@/lib/registry/category-mappings";

// With:
import { getComponentsForCategoriesDerived as getComponentsForCategories, type CategoryKey } from "@/lib/registry/category-mappings";
```

**Step 4: Verify compile and test**

```bash
npx tsc --noEmit
curl -s http://localhost:3000/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a dashboard with bento grid"}' | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print('selectedComponents:', d['metadata']['selectedComponents'])"
```

Expected: `selectedComponents: 33` or higher.

**Step 5: Commit**

```bash
git add src/lib/registry/category-mappings.ts src/lib/registry/index.ts src/lib/generation/component-selection.ts
git commit -m "feat: derive category-component mappings from registry, eliminate manual sync"
```

---

## Task 12: Add New Intent Categories to categoryMappings

**Files:**
- Modify: `src/lib/registry/category-mappings.ts`

Add the new category keys to the `CategoryKey` / `IntentCategory` union, and add empty stub entries in `categoryMappings` so the old code path doesn't break:

```typescript
// In categoryMappings, add these entries:
showcase: [
  // Auto-derived — components assign themselves via categories: ["showcase"]
  // This stub exists for backward compat with the old manual-lookup path
],
carousel: [],
testimonials: [],
pricing: [],
portfolio: [],
hero: [],
dock: [],
"backgrounds-animated": [],
```

And add these keys to the `CategoryKey` type export:

```typescript
export type CategoryKey = keyof typeof categoryMappings;
// Now includes "showcase" | "carousel" | "testimonials" | "pricing" | "portfolio" | "hero" | "dock" | "backgrounds-animated"
```

**Step 3: Verify that old `getComponentsForCategories` still works**

```bash
node -e "const {getComponentsForCategories} = require('./src/lib/registry/category-mappings'); console.log(getComponentsForCategories(['navigation']).length)"
```

Expected: number > 0

**Step 4: Commit**

```bash
git add src/lib/registry/category-mappings.ts
git commit -m "feat: add new intent categories: showcase, carousel, testimonials, pricing, dock, hero"
```

---

## Task 13: Hybrid Component Selection — Alias Matching + LLM Categories

**Files:**
- Modify: `src/lib/generation/component-selection.ts`

This is the most impactful change for generation quality. Replace the current single-pass LLM selection with a two-pass hybrid:

1. **Pass 1 (alias matching):** Scan the user prompt for component aliases → always surfaces explicitly-named or described components
2. **Pass 2 (LLM category matching):** Existing LLM call for intent categories
3. **Merge:** Union of both passes, deduplicated

**Step 1: Add an alias-based matcher function**

Add to `component-selection.ts`:

```typescript
import { componentRegistry } from "@/lib/registry/components";

/**
 * Pass 1: Find components whose aliases match words in the user prompt.
 * This ensures components described by natural name are never filtered out.
 */
function findComponentsByAliasMatch(userPrompt: string): string[] {
  const prompt = userPrompt.toLowerCase();
  const matches = new Set<string>();

  for (const [name, meta] of Object.entries(componentRegistry)) {
    const aliasMatch = meta.aliases.some(alias =>
      prompt.includes(alias.toLowerCase())
    );
    const whenToUseMatch = meta.whenToUse
      ? prompt.split(/\s+/).some(word =>
          word.length > 4 && meta.whenToUse.toLowerCase().includes(word)
        )
      : false;

    if (aliasMatch || whenToUseMatch) {
      matches.add(name);
      // Also add required parent/child companions
      if (name === "BentoGridItem") matches.add("BentoGrid");
      if (name === "BentoGrid") matches.add("BentoGridItem");
      if (name === "ThreeDCardItem" || name === "ThreeDCardBody") matches.add("ThreeDCard");
    }
  }

  return Array.from(matches);
}
```

**Step 2: Update `selectRelevantComponents` to use both passes**

Replace the function body (keep signature):

```typescript
export async function selectRelevantComponents(
  userPrompt: string
): Promise<string[]> {
  // Check cache first
  const cached = getCachedSelection(userPrompt);
  if (cached) {
    console.log(`[Component Selection] Cache hit for prompt`);
    return cached;
  }

  // Pass 1: Alias matching (synchronous, no LLM call)
  const aliasMatches = findComponentsByAliasMatch(userPrompt);
  console.log(`[Component Selection] Alias matches (${aliasMatches.length}): ${aliasMatches.join(', ')}`);

  // Pass 2: LLM category selection
  let categoryComponents: string[] = [];
  try {
    const categories = getAllCategoryKeys();
    const selectionPrompt = buildSelectionPrompt(userPrompt, categories);

    const response = await generateText({
      model: getSelectionModel(),
      prompt: selectionPrompt,
      maxTokens: 150,
    });

    const rawCategories = response.text.split(',').map(c => c.trim().toLowerCase());
    console.log(`[Component Selection] LLM returned categories: ${rawCategories.join(', ')}`);

    const selectedCategories = rawCategories
      .filter(c => categories.includes(c as CategoryKey)) as CategoryKey[];

    console.log(`[Component Selection] Valid categories: ${selectedCategories.join(', ')}`);
    categoryComponents = getComponentsForCategories(selectedCategories);
    console.log(`[Component Selection] Category components: ${categoryComponents.length}`);
  } catch (error) {
    console.error('[Component Selection] LLM error, using alias matches only:', error);
  }

  // Merge both passes
  const merged = new Set<string>([
    // Core always included
    "Flex", "Grid", "Container", "Section", "Stack", "Center",
    ...aliasMatches,
    ...categoryComponents,
  ]);

  // Safety net: if merged set is very small (< 12), broaden with suggestCategories
  if (merged.size < 12) {
    console.warn(`[Component Selection] Only ${merged.size} components, broadening with keyword fallback`);
    const { suggestCategories } = await import("@/lib/registry/category-mappings");
    const suggestedCats = suggestCategories(userPrompt);
    const suggestedComponents = getComponentsForCategories(suggestedCats);
    suggestedComponents.forEach(c => merged.add(c));
    console.log(`[Component Selection] After broadening: ${merged.size} components`);
  }

  const result = Array.from(merged);
  cacheSelection(userPrompt, result);
  return result;
}
```

**Step 3: Extract the prompt builder into a helper (keep it clean)**

```typescript
function buildSelectionPrompt(userPrompt: string, categories: CategoryKey[]): string {
  return `You are a UI component selector. Analyze the user's request and determine which component categories are relevant.

User request: "${userPrompt}"

Available categories:
${categories.map(c => `- ${c}`).join('\n')}

Instructions:
1. Identify the type of UI being requested (dashboard, landing page, form, etc.)
2. Identify any visual styles (animated, 3d, glassmorphism, neon, gradient, etc.)
3. Identify specific component needs (navigation, backgrounds, carousel, bento, dock, etc.)
4. Return ONLY category names that are relevant, comma-separated

Examples:
- "animated landing page with aurora background" → landing page, animated, backgrounds, backgrounds-animated
- "dashboard with charts" → dashboard, charts, analytics, data
- "showcase with bento grid and testimonials" → showcase, landing page, cards, testimonials
- "floating dock macOS navigation" → navigation, dock, animated, desktop
- "infinite scrolling testimonial carousel" → carousel, testimonials, animated, landing page

Return ONLY the category names (comma-separated), nothing else:`;
}
```

**Step 4: Test the hybrid selection**

```bash
# This should now return > 6 components and include FloatingDock, BentoGrid, InfiniteMovingCards
curl -s http://localhost:3000/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a showcase page with a floating dock navigation, bento grid layout with cards, and infinite moving cards carousel"}' | \
  python3 -c "
import json, sys
d = json.load(sys.stdin)
print('selectedComponents:', d['metadata']['selectedComponents'])
print('componentsUsed:', d['metadata']['componentsUsed'])
"
```

Expected:
- `selectedComponents` > 20
- `componentsUsed` includes `FloatingDock`, `BentoGrid`, `InfiniteMovingCards`

**Step 5: Commit**

```bash
git add src/lib/generation/component-selection.ts
git commit -m "feat: hybrid component selection — alias matching + LLM categories + safety broadening"
```

---

## Task 14: Update the Generation System Prompt to Include aliases/whenToUse

**Files:**
- Modify: `src/lib/generation/prompts.ts`
- Modify: `src/lib/registry/components.ts` (`generateLLMComponentDocs` function)

The component docs shown to the LLM should surface `whenToUse` so it picks the right component.

**Step 1: Find `generateLLMComponentDocs` in components.ts**

```bash
grep -n "generateLLMComponentDocs" src/lib/registry/components.ts
```

**Step 2: Update it to include `whenToUse` in the per-component doc block**

Find the function and update the component doc format to include:

```typescript
// In the generated docs per component, add after description:
// ${meta.whenToUse ? `When to use: ${meta.whenToUse}` : ""}
// Library: ${meta.library}
```

**Step 3: Verify the system prompt now mentions whenToUse**

```bash
curl -s http://localhost:3000/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"SaaS landing page with bento grid"}' | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print('used:', d['metadata']['componentsUsed'])"
```

Expected: `BentoGrid` and/or `BentoGridItem` in the used list.

**Step 4: Commit**

```bash
git add src/lib/registry/components.ts src/lib/generation/prompts.ts
git commit -m "feat: include whenToUse in LLM component documentation"
```

---

## Task 15: Integration Tests

**Files:**
- Create: `src/lib/generation/__tests__/component-selection.test.ts`

**Step 1: Write failing tests**

```typescript
import { selectRelevantComponents } from "../component-selection";

describe("selectRelevantComponents", () => {
  // Alias matching tests (no LLM needed)
  it("finds FloatingDock when prompt mentions 'floating dock'", async () => {
    const result = await selectRelevantComponents("build a page with floating dock navigation");
    expect(result).toContain("FloatingDock");
  });

  it("finds BentoGrid when prompt mentions 'bento'", async () => {
    const result = await selectRelevantComponents("create a bento grid layout");
    expect(result).toContain("BentoGrid");
    expect(result).toContain("BentoGridItem");
  });

  it("finds InfiniteMovingCards when prompt mentions 'infinite carousel'", async () => {
    const result = await selectRelevantComponents("add an infinite scrolling testimonial carousel");
    expect(result).toContain("InfiniteMovingCards");
  });

  it("never returns fewer than 6 components", async () => {
    const result = await selectRelevantComponents("a showcase page");
    expect(result.length).toBeGreaterThanOrEqual(6);
  });

  it("always includes core layout components", async () => {
    const result = await selectRelevantComponents("make something");
    expect(result).toContain("Flex");
    expect(result).toContain("Container");
  });
});
```

**Step 2: Run tests**

```bash
npx jest src/lib/generation/__tests__/component-selection.test.ts --no-coverage
```

Note: Tests requiring alias matching (no LLM) should pass immediately. Tests triggering LLM calls require the API key.

**Step 3: Commit**

```bash
git add src/lib/generation/__tests__/component-selection.test.ts
git commit -m "test: add integration tests for hybrid component selection"
```

---

## Verification Checklist

After all tasks are complete:

```bash
# 1. TypeScript compiles clean
npx tsc --noEmit

# 2. All components have metadata (no missing fields)
npx tsc --noEmit 2>&1 | grep "missing" | wc -l  # expected: 0

# 3. Test the original failing case
curl -s http://localhost:3000/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a showcase page with a floating dock navigation, bento grid layout with cards, and infinite moving cards carousel"}' | \
  python3 -c "
import json, sys
d = json.load(sys.stdin)
meta = d['metadata']
used = meta['componentsUsed']
print(f'Selected: {meta[\"selectedComponents\"]} | Used: {used}')
assert 'FloatingDock' in used or meta['selectedComponents'] > 20, 'FAIL: FloatingDock not used/available'
assert 'BentoGrid' in used or meta['selectedComponents'] > 20, 'FAIL: BentoGrid not used/available'
assert 'InfiniteMovingCards' in used, 'FAIL: InfiniteMovingCards not used'
print('ALL CHECKS PASSED')
"
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `ComponentMeta`, `ComponentBehavior`, `ComponentType`, `PageLocation`, `ComponentLibrary`, `IntentCategory` |
| `src/lib/registry/components.ts` | Update all 181 component entries with full `ComponentMeta` |
| `src/lib/registry/category-mappings.ts` | Add new categories; add derived lookup functions |
| `src/lib/registry/index.ts` | Add `getComponentNamesByIntentCategory`, `getComponentNamesByIntentCategories` |
| `src/lib/generation/component-selection.ts` | Hybrid selection: alias matching + LLM + safety broadening |
| `src/lib/generation/prompts.ts` | Surface `whenToUse` in LLM documentation |
