import type { ComponentDefinition, ComponentCategory, ComponentMeta } from "@/types";
import { componentSchemas, type ComponentName } from "./schemas";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * Full component registry with metadata for each registered component.
 * This powers:
 * 1. LLM context — the AI knows what components are available
 * 2. Validation — generated schemas are validated against these
 * 3. Documentation — auto-generated docs for LLM (Syntux-style llmContext)
 */

const registry: Record<ComponentName, ComponentMeta> = {
  // Layout
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

  // Display
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

  // Card
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

  // Input
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

  // Data
  DataTable: {
    description: "Rich data table with typed columns, sorting, pagination. Column types: text, number, badge, avatar, action.",
    category: "data",
    tags: ["table", "data", "grid", "list"],
    allowedChildren: [],
  },
  List: {
    description: "Structured list of items with title, description, icon, and optional badge. Variants: default, bordered, card.",
    category: "data",
    tags: ["list", "items", "menu"],
  },
  Tree: {
    description: "Hierarchical tree view with expandable/collapsible nodes. Supports nested children and icons.",
    category: "data",
    tags: ["tree", "hierarchy", "nested", "explorer"],
  },
  DescriptionList: {
    description: "Key-value description list with term/description pairs. Layouts: vertical, horizontal, grid.",
    category: "data",
    tags: ["description", "list", "key-value", "details"],
  },
  Pagination: {
    description: "Pagination control for navigating through pages of data. Shows first/last page buttons.",
    category: "data",
    tags: ["pagination", "pages", "navigation", "data"],
  },
  EmptyState: {
    description: "Placeholder display for empty data states. Shows icon, title, description, and optional action button.",
    category: "data",
    tags: ["empty", "state", "placeholder", "no-data"],
  },
  InfiniteScroll: {
    description: "Infinite scrolling container that loads more items as the user scrolls. Shows loading indicator.",
    category: "data",
    tags: ["infinite", "scroll", "lazy-load", "list"],
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

  // Chart
  BarChart: {
    description: "Bar chart for comparing values across categories. Supports stacked and horizontal modes.",
    category: "chart",
    tags: ["chart", "bar", "analytics", "visualization"],
  },
  LineChart: {
    description: "Line chart for showing trends over time. Supports multiple series, grid, and dots.",
    category: "chart",
    tags: ["chart", "line", "trend", "analytics"],
  },
  PieChart: {
    description: "Pie/donut chart for showing proportions. Supports labels and donut mode.",
    category: "chart",
    tags: ["chart", "pie", "donut", "proportion"],
  },
  AreaChart: {
    description: "Area chart for showing cumulative values. Supports stacking and gradients.",
    category: "chart",
    tags: ["chart", "area", "trend", "analytics"],
  },
  RadarChart: {
    description: "Radar/spider chart for comparing multiple variables across categories. Supports multiple data series.",
    category: "chart",
    tags: ["chart", "radar", "spider", "comparison", "analytics"],
  },
  ScatterChart: {
    description: "Scatter plot for showing correlation between two variables. Supports optional size and color encoding.",
    category: "chart",
    tags: ["chart", "scatter", "plot", "correlation", "analytics"],
  },

  // Navigation
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
    whenToUse: "Use for mobile app-style bottom navigation with 3-5 tab items.",
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

  // Composite
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
  KanbanBoard: {
    description: "Kanban-style board with columns and cards. Cards have priority, assignee, tags, due dates.",
    category: "composite",
    tags: ["kanban", "board", "project-management", "tasks"],
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
  Changelog: {
    description: "Changelog display with versioned entries. Entry types: feature, fix, improvement, breaking.",
    category: "composite",
    tags: ["changelog", "release", "version", "updates"],
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
  FileExplorer: {
    description: "File explorer tree with files and folders. Shows name, type, size, modified date, and nested children.",
    category: "composite",
    tags: ["file", "explorer", "directory", "browser"],
  },
  Chat: {
    description: "Chat interface with message history and input. Supports user, assistant, and system roles with timestamps.",
    category: "composite",
    tags: ["chat", "messaging", "conversation", "ai"],
    allowedChildren: ["*"],
  },
  Calendar: {
    description: "Calendar with events. Views: month, week, day. Events have title, date, time, color, and description.",
    category: "composite",
    tags: ["calendar", "events", "schedule", "date"],
  },
  Weather: {
    description: "Weather widget with current conditions and optional forecast. Supports celsius and fahrenheit.",
    category: "composite",
    tags: ["weather", "forecast", "temperature", "widget"],
  },
  MusicPlayer: {
    description: "Music player with track info, playback controls, progress bar, and optional queue.",
    category: "composite",
    tags: ["music", "player", "audio", "media"],
  },
  VideoPlayer: {
    description: "Video player with title, description, thumbnail, and configurable aspect ratio.",
    category: "composite",
    tags: ["video", "player", "media", "streaming"],
  },
  Gallery: {
    description: "Image gallery with grid, masonry, or carousel layouts. Configurable columns and gap.",
    category: "composite",
    tags: ["gallery", "images", "photos", "media"],
  },
  Map: {
    description: "Interactive map display with markers, center coordinates, and zoom level.",
    category: "composite",
    tags: ["map", "location", "markers", "geography"],
  },
  Terminal: {
    description: "Terminal emulator display with input/output/error lines and configurable prompt.",
    category: "composite",
    tags: ["terminal", "console", "cli", "shell"],
  },
  CodeEditor: {
    description: "Multi-file code editor with tabs, syntax highlighting, line numbers, and dark/light themes.",
    category: "composite",
    tags: ["code", "editor", "ide", "programming"],
  },
  Markdown: {
    description: "Markdown content renderer. Displays formatted markdown text with proper styling.",
    category: "composite",
    tags: ["markdown", "content", "text", "documentation"],
  },
  Progress: {
    description: "Progress bar with value, label, and variant. Sizes: sm, md, lg.",
    category: "feedback",
    tags: ["progress", "loading", "status"],
  },
  Alert: {
    description: "Alert message box with variants: default, info, success, warning, error. Supports icon and dismissible option.",
    category: "feedback",
    tags: ["alert", "message", "notification", "status"],
  },
  Toast: {
    description: "Temporary toast notification with auto-dismiss. Variants: default, success, error, warning, info.",
    category: "feedback",
    tags: ["toast", "notification", "popup", "snackbar"],
  },
  Dialog: {
    description: "Modal dialog with title, description, and confirm/cancel actions. Variants: default, destructive.",
    category: "feedback",
    tags: ["dialog", "modal", "popup", "confirmation"],
    allowedChildren: ["*"],
  },
  Drawer: {
    description: "Slide-out drawer panel from any edge. Configurable side (left, right, top, bottom) and size.",
    category: "feedback",
    tags: ["drawer", "panel", "slide", "overlay"],
    allowedChildren: ["*"],
  },
  Popover: {
    description: "Popover floating content triggered by click. Configurable placement side.",
    category: "feedback",
    tags: ["popover", "popup", "floating", "overlay"],
    allowedChildren: ["*"],
  },
  Tooltip: {
    description: "Hover tooltip that displays additional text. Configurable placement side.",
    category: "feedback",
    tags: ["tooltip", "hover", "hint", "info"],
  },
  Banner: {
    description: "Full-width banner for announcements. Variants: info, success, warning, error. Supports dismiss and action link.",
    category: "feedback",
    tags: ["banner", "announcement", "notification", "bar"],
  },
  Notification: {
    description: "Notification list with read/unread state, timestamps, icons, and type-based styling.",
    category: "feedback",
    tags: ["notification", "alerts", "inbox", "updates"],
  },
  ConfirmDialog: {
    description: "Confirmation dialog for destructive or important actions. Variants: default, destructive.",
    category: "feedback",
    tags: ["confirm", "dialog", "modal", "action"],
  },

  // Aceternity UI Components
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

  // React Bits Components
  GlassmorphismCard: {
    description: "Card with glassmorphism effect (frosted glass look). Configurable blur intensity for depth and transparency effects.",
    category: "display",
    tags: ["card", "glassmorphism", "blur", "modern", "reactbits"],
    allowedChildren: ["*"],
  },
  NeonButton: {
    description: "Button with neon glow effect. Customizable glow color creates a vibrant, futuristic appearance.",
    category: "input",
    tags: ["button", "neon", "glow", "vibrant", "reactbits"],
  },
  GradientText: {
    description: "Text with animated gradient. Optional animation makes gradient flow across text for eye-catching headings.",
    category: "display",
    tags: ["text", "gradient", "animation", "typography", "reactbits"],
  },
  AnimatedBorder: {
    description: "Container with animated rotating gradient border. Creates dynamic, attention-grabbing frames around content.",
    category: "display",
    tags: ["border", "animation", "gradient", "container", "reactbits"],
    allowedChildren: ["*"],
  },
  GlitchText: {
    description: "Text with glitch animation effect. RGB color separation creates a digital distortion aesthetic.",
    category: "display",
    tags: ["text", "glitch", "animation", "effect", "reactbits"],
  },
  MorphingText: {
    description: "Text that morphs between multiple values with smooth transitions. Perfect for rotating taglines or features.",
    category: "display",
    tags: ["text", "morph", "animation", "transition", "reactbits"],
  },
  TiltCard: {
    description: "Card that tilts in 3D space based on mouse position. Creates an interactive parallax effect on hover.",
    category: "display",
    tags: ["card", "tilt", "3d", "interactive", "hover", "reactbits"],
    allowedChildren: ["*"],
  },
  ParallaxCard: {
    description: "Card with parallax effect where content moves based on mouse position. Creates depth and interactivity.",
    category: "display",
    tags: ["card", "parallax", "interactive", "hover", "reactbits"],
    allowedChildren: ["*"],
  },
  HoverCardRB: {
    description: "Interactive hover card with scale and glow effects. Highlights on hover for engaging user interaction.",
    category: "display",
    tags: ["card", "hover", "interactive", "scale", "glow", "reactbits"],
    allowedChildren: ["*"],
  },
  ShinyButton: {
    description: "Button with shiny shimmer animation. Light reflection sweeps across on hover for premium feel.",
    category: "input",
    tags: ["button", "shiny", "shimmer", "animation", "premium", "reactbits"],
  },
  FloatingLabel: {
    description: "Input field with floating label animation. Label moves up when field is focused or has value.",
    category: "input",
    tags: ["input", "label", "floating", "animation", "form", "reactbits"],
  },
  AnimatedInput: {
    description: "Input field with animated focus effects. Border and shadow animate smoothly on focus for better UX.",
    category: "input",
    tags: ["input", "animation", "focus", "form", "reactbits"],
  },
  RippleButton: {
    description: "Button with material-design ripple effect on click. Visual feedback spreads from click point.",
    category: "input",
    tags: ["button", "ripple", "click", "material", "feedback", "reactbits"],
  },
  MagneticButton: {
    description: "Button that moves toward the cursor like a magnet. Creates playful, engaging hover interaction.",
    category: "input",
    tags: ["button", "magnetic", "hover", "interactive", "playful", "reactbits"],
  },
  SmoothScroll: {
    description: "Container with smooth scroll animation. Creates fluid, inertia-based scrolling for polished feel.",
    category: "layout",
    tags: ["scroll", "smooth", "animation", "container", "reactbits"],
    allowedChildren: ["*"],
  },
  RevealText: {
    description: "Text that reveals character by character with animation. Creates typewriter-like appearance effect.",
    category: "display",
    tags: ["text", "reveal", "animation", "typewriter", "reactbits"],
  },
  CountUp: {
    description: "Animated number counter that counts up to target value. Perfect for statistics and metrics display.",
    category: "display",
    tags: ["counter", "number", "animation", "statistics", "reactbits"],
  },
  TypeWriter: {
    description: "Typewriter effect text animation with optional cursor. Types out text one character at a time.",
    category: "display",
    tags: ["text", "typewriter", "animation", "cursor", "reactbits"],
  },

  // Chakra UI
  ChakraStat: {
    description: "Statistics display container. Use with ChakraStatLabel, ChakraStatNumber, and ChakraStatHelpText for complete stat displays.",
    category: "display",
    tags: ["stat", "statistics", "data", "chakra"],
    allowedChildren: ["ChakraStatLabel", "ChakraStatNumber", "ChakraStatHelpText"],
  },
  ChakraStatLabel: {
    description: "Label for a statistic. Use inside ChakraStat.",
    category: "display",
    tags: ["stat", "label", "chakra"],
  },
  ChakraStatNumber: {
    description: "Numeric value display for statistics. Use inside ChakraStat.",
    category: "display",
    tags: ["stat", "number", "value", "chakra"],
  },
  ChakraStatHelpText: {
    description: "Helper text and trend indicator for statistics. Use inside ChakraStat.",
    category: "display",
    tags: ["stat", "help", "trend", "chakra"],
  },
  ChakraCircularProgress: {
    description: "Circular progress indicator with customizable size, color, and thickness. Can display value label.",
    category: "feedback",
    tags: ["progress", "circular", "loading", "indicator", "chakra"],
  },
  ChakraSimpleGrid: {
    description: "Simple responsive grid layout with configurable columns and spacing. Easier than CSS Grid for simple layouts.",
    category: "layout",
    tags: ["grid", "layout", "responsive", "chakra"],
    allowedChildren: ["*"],
  },
  ChakraWrap: {
    description: "Wrapping flex container that flows children to next line when space runs out. Similar to flexbox with flex-wrap.",
    category: "layout",
    tags: ["wrap", "layout", "flex", "responsive", "chakra"],
    allowedChildren: ["*"],
  },
  ChakraTag: {
    description: "Tag/label component for categories, status, or attributes. Supports icons and close button.",
    category: "display",
    tags: ["tag", "label", "badge", "category", "chakra"],
  },
  ChakraDivider: {
    description: "Visual divider line (horizontal or vertical) to separate content.",
    category: "display",
    tags: ["divider", "separator", "line", "chakra"],
  },
  ChakraKbd: {
    description: "Keyboard key display for showing keyboard shortcuts (e.g., Cmd+K).",
    category: "display",
    tags: ["keyboard", "kbd", "shortcut", "key", "chakra"],
  },
  ChakraVisuallyHidden: {
    description: "Hides content visually but keeps it accessible to screen readers. For accessibility.",
    category: "display",
    tags: ["accessibility", "hidden", "sr-only", "chakra"],
  },
  ChakraPortal: {
    description: "Renders children into a DOM node outside the parent hierarchy. Useful for modals and overlays.",
    category: "layout",
    tags: ["portal", "overlay", "modal", "chakra"],
    allowedChildren: ["*"],
  },
  ChakraCloseButton: {
    description: "Close button with consistent styling. Commonly used in modals, toasts, and dismissible components.",
    category: "input",
    tags: ["close", "button", "dismiss", "chakra"],
  },
  ChakraIconButton: {
    description: "Button that displays only an icon. Use for compact actions.",
    category: "input",
    tags: ["button", "icon", "action", "chakra"],
  },
  ChakraNumberInput: {
    description: "Number input with increment/decrement steppers. Supports min, max, step, and precision.",
    category: "input",
    tags: ["input", "number", "stepper", "form", "chakra"],
  },

  // Material UI
  MuiDataGrid: {
    description: "Advanced data grid with sorting, filtering, pagination, and cell editing. Ideal for large datasets.",
    category: "data",
    tags: ["table", "grid", "data", "sorting", "filtering", "pagination", "mui", "material"],
  },
  MuiTreeView: {
    description: "Hierarchical tree structure for displaying nested data. Supports expand/collapse.",
    category: "data",
    tags: ["tree", "hierarchy", "nested", "expandable", "mui", "material"],
  },
  MuiTimeline: {
    description: "Timeline component for displaying chronological events. Supports left, right, and alternating positions.",
    category: "display",
    tags: ["timeline", "events", "chronological", "history", "mui", "material"],
  },
  MuiStepper: {
    description: "Step progress indicator for multi-step processes. Supports horizontal and vertical orientations.",
    category: "navigation",
    tags: ["stepper", "steps", "progress", "wizard", "form", "mui", "material"],
  },
  MuiSpeedDial: {
    description: "Floating action button that expands to show multiple actions. Material Design speed dial pattern.",
    category: "navigation",
    tags: ["speed-dial", "fab", "floating", "actions", "menu", "mui", "material"],
  },
  MuiRating: {
    description: "Star rating component for collecting user ratings. Supports half-star precision and custom icons.",
    category: "input",
    tags: ["rating", "stars", "review", "feedback", "mui", "material"],
  },
  MuiAutocomplete: {
    description: "Autocomplete input with suggestions dropdown. Supports single/multiple selection and free text input.",
    category: "input",
    tags: ["autocomplete", "search", "input", "suggestions", "select", "mui", "material"],
  },
  MuiPagination: {
    description: "Pagination controls for navigating through pages. Material Design style with various shapes and sizes.",
    category: "navigation",
    tags: ["pagination", "pages", "navigation", "mui", "material"],
  },
  MuiBreadcrumbs: {
    description: "Breadcrumb navigation showing the current page's location in the hierarchy.",
    category: "navigation",
    tags: ["breadcrumbs", "navigation", "hierarchy", "path", "mui", "material"],
  },
  MuiImageList: {
    description: "Masonry-style image grid with multiple layout variants (standard, quilted, woven, masonry).",
    category: "display",
    tags: ["images", "gallery", "grid", "masonry", "photos", "mui", "material"],
  },

  // Magic UI Components
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
  BoxReveal: {
    description: "Box reveal animation where content is unveiled by a sliding colored box. Great for sequential content display.",
    category: "display",
    tags: ["animation", "reveal", "box", "magic-ui", "effect"],
    allowedChildren: ["*"],
  },
  GradientHeading: {
    description: "Heading with gradient text color. Use for eye-catching titles with smooth color transitions.",
    category: "display",
    tags: ["heading", "gradient", "text", "magic-ui", "typography"],
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
};

/**
 * Get all component definitions for the registry.
 */
export function getComponentDefinitions(): ComponentDefinition[] {
  return (Object.keys(registry) as ComponentName[]).map((name) => ({
    name,
    description: registry[name].description,
    category: (registry[name].categories?.[0] ?? "composite") as ComponentCategory,
    propsSchema: componentSchemas[name],
    allowedChildren: registry[name].allowedChildren,
    tags: registry[name].tags,
  }));
}

/**
 * Get component definitions filtered by category.
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
  return getComponentDefinitions().filter((c) => c.category === category);
}

/**
 * Get a single component definition by name.
 */
export function getComponentDefinition(name: string): ComponentDefinition | undefined {
  if (name in registry) {
    const key = name as ComponentName;
    return {
      name: key,
      description: registry[key].description,
      category: (registry[key].categories?.[0] ?? "composite") as ComponentCategory,
      propsSchema: componentSchemas[key],
      allowedChildren: registry[key].allowedChildren,
      tags: registry[key].tags,
    };
  }
  return undefined;
}

/**
 * Generate LLM context documentation for all components.
 * This is the Syntux-style llmContext that's auto-generated from component schemas.
 */
export function generateLLMComponentDocs(allowedComponents?: string[]): string {
  let definitions = getComponentDefinitions();

  // Filter to only allowed components if specified
  if (allowedComponents && allowedComponents.length > 0) {
    definitions = definitions.filter(d => allowedComponents.includes(d.name));
  }

  const docs: string[] = [];

  docs.push("# Available Components\n");
  docs.push("Use these components to compose the UI. Each component has typed props.\n");
  docs.push("IMPORTANT: Follow the prop type constraints exactly as specified.\n");

  const categories = [...new Set(definitions.map((d) => d.category))];

  for (const category of categories) {
    docs.push(`\n## ${category.charAt(0).toUpperCase() + category.slice(1)} Components\n`);

    const components = definitions.filter((d) => d.category === category);
    for (const comp of components) {
      docs.push(`### ${comp.name}`);
      docs.push(`${comp.description}`);
      // Include whenToUse and library from the full registry metadata
      const meta = registry[comp.name as ComponentName];
      if (meta?.whenToUse) {
        docs.push(`When to use: ${meta.whenToUse}`);
      }
      if (meta?.library) {
        docs.push(`Library: ${meta.library}`);
      }
      docs.push(`Tags: ${comp.tags.join(", ")}`);
      if (comp.allowedChildren) {
        docs.push(`Children: ${comp.allowedChildren.join(", ")}`);
      }

      // Add prop schema info
      const schema = comp.propsSchema;
      if (schema && '_def' in schema && 'shape' in (schema._def as any)) {
        const shape = (schema._def as any).shape() as Record<string, any>;
        const propDocs: string[] = [];

        for (const [key, value] of Object.entries(shape)) {
          let propType = value._def?.typeName || 'unknown';
          let typeStr = '';

          // Handle ZodEffects (schemas with .transform())
          if (propType === 'ZodEffects') {
            propType = value._def?.schema?._def?.typeName || 'unknown';
          }

          if (propType === 'ZodNumber') {
            const min = value._def?.checks?.find((c: any) => c.kind === 'min')?.value;
            const max = value._def?.checks?.find((c: any) => c.kind === 'max')?.value;
            typeStr = `number${min !== undefined ? ` (${min}-${max})` : ''}`;
          } else if (propType === 'ZodString') {
            typeStr = 'string';
          } else if (propType === 'ZodBoolean') {
            typeStr = 'boolean';
          } else if (propType === 'ZodEnum') {
            // Get enum values (handle both direct ZodEnum and those wrapped in ZodEffects)
            const enumDef = value._def?.typeName === 'ZodEffects' ? value._def?.schema?._def : value._def;
            const values = enumDef?.values || [];
            const firstValue = values[0];
            // Add example showing the CORRECT enum value (not AI's intuitive one)
            typeStr = `enum: ${values.join(' | ')} (example: "${firstValue}")`;
          } else if (propType === 'ZodArray') {
            typeStr = 'array';
          } else {
            typeStr = propType.replace('Zod', '').toLowerCase();
          }

          const optional = value.isOptional() ? ' (optional)' : '';
          const defaultVal = value._def?.defaultValue?.() !== undefined
            ? ` = ${JSON.stringify(value._def.defaultValue())}`
            : '';

          propDocs.push(`  - ${key}: ${typeStr}${optional}${defaultVal}`);
        }

        if (propDocs.length > 0) {
          docs.push(`Props:`);
          docs.push(propDocs.join('\n'));
        }

        // Add JSON Schema representation for precise type information
        try {
          const jsonSchema = zodToJsonSchema(schema, {
            name: comp.name,
            target: "openApi3",
            errorMessages: true,
          });

          docs.push(`\nJSON Schema (use this for precise type validation):`);
          docs.push('```json');
          docs.push(JSON.stringify(jsonSchema, null, 2));
          docs.push('```');
        } catch (error) {
          // If JSON Schema conversion fails, continue without it
          console.warn(`Failed to generate JSON Schema for ${comp.name}:`, error);
        }
      }

      docs.push("");
    }
  }

  return docs.join("\n");
}

/**
 * Get all component names as a list for allowedComponents constraint.
 */
export function getAllComponentNames(): ComponentName[] {
  return Object.keys(registry) as ComponentName[];
}

/**
 * Get the full registry as a plain object for derived lookups.
 * Returns a shallow copy to avoid external mutation.
 */
export function getFullRegistry(): Record<string, ComponentMeta> {
  return { ...registry };
}
