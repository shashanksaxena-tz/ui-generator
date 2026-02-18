# LLM-Based Component Selection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement intelligent component selection that analyzes user prompts and filters the component registry to only relevant components, enabling support for 150-200+ components while maintaining manageable token budgets (15k-25k tokens per generation).

**Architecture:** Two-stage LLM approach where Stage 1 uses a fast, cheap model (Haiku) to analyze the user's prompt and select relevant component categories, then Stage 2 uses the main model (Sonnet) to generate UI with a filtered component registry containing only 30-50 relevant components instead of all 150-200.

**Tech Stack:** TypeScript, Next.js, AI SDK (Vercel), Claude Haiku (selection), Claude Sonnet (generation), Zod schemas, React components from shadcn/ui, Aceternity UI, Magic UI, React Bits, Chakra UI, Material UI

---

## Phase 1: Component Library Research & Cataloging

### Task 1: Research Aceternity UI Components

**Files:**
- Create: `docs/component-catalogs/aceternity-ui.md`

**Step 1: Visit Aceternity UI and catalog components**

Navigate to https://ui.aceternity.com/components and document all available components.

**Step 2: Create catalog document**

```markdown
# Aceternity UI Component Catalog

## Animation Effects (15 components)
- 3DCard - Interactive 3D card with tilt effect
- AuroraBackground - Animated aurora borealis background
- WavyBackground - Wavy animated background gradient
- Spotlight - Spotlight effect following cursor
- LampEffect - Lamp illumination effect
- BackgroundGradient - Animated gradient background
- BackgroundBeams - Animated beam effects
- Meteors - Falling meteor animation
- Particles - Particle system animation
- GlowingStars - Glowing star field effect
- ShootingStars - Shooting star animation
- FloatingDock - Floating MacOS-style dock
- Globe - Interactive 3D globe
- AnimatedBeam - Animated connection beam
- SparklesCore - Sparkle particle effect

## Hero Sections (5 components)
- HeroParallax - Parallax scrolling hero
- HeroHighlight - Hero with text highlight effect
- TypewriterEffect - Typewriter text animation
- TextGenerateEffect - Text generation animation
- MovingBorder - Moving border button

## Layout Components (8 components)
- BentoGrid - Bento box grid layout
- InfiniteMovingCards - Infinite scrolling cards
- CardStack - Stacked card carousel
- LayoutGrid - Grid with hover effects
- StickyScroll - Sticky scroll reveal
- Timeline - Animated timeline
- Tabs - Animated tabs component
- AnimatedTooltip - Tooltip with animation

## Interactive (7 components)
- HoverEffect - Card hover effects
- TracingBeam - Beam following scroll
- FollowingPointer - Pointer follower effect
- BackgroundBoxes - Animated box grid
- CanvasRevealEffect - Canvas reveal animation
- CardHoverEffect - Card 3D hover
- MultiStepLoader - Multi-step loading animation

**Priority: 35 components total**
```

**Step 3: Commit**

```bash
git add docs/component-catalogs/aceternity-ui.md
git commit -m "docs: catalog Aceternity UI components"
```

---

### Task 2: Research Magic UI Components

**Files:**
- Create: `docs/component-catalogs/magic-ui.md`

**Step 1: Visit Magic UI and catalog components**

Navigate to https://magicui.design/docs/components and document all available components.

**Step 2: Create catalog document**

```markdown
# Magic UI Component Catalog

## Animation Components (12 components)
- AnimatedBeam - Animated connection beam
- AnimatedGradient - Gradient animation
- BlurFade - Blur fade-in animation
- BorderBeam - Animated border beam
- BoxReveal - Box reveal animation
- GradientHeading - Gradient text heading
- Meteors - Meteor shower effect
- NumberTicker - Animated number counter
- Particles - Particle animation
- Ripple - Ripple effect
- ShimmerButton - Shimmer button effect
- WordPullUp - Word pull-up animation

## Interactive Components (8 components)
- Globe - Interactive 3D globe
- Marquee - Infinite marquee scroll
- OrbitingCircles - Orbiting circles animation
- RetroGrid - Retro grid background
- DotPattern - Animated dot pattern
- GridPattern - Animated grid pattern
- Spotlight - Spotlight effect
- MagicCard - Card with magic effect

**Priority: 20 components total**
```

**Step 3: Commit**

```bash
git add docs/component-catalogs/magic-ui.md
git commit -m "docs: catalog Magic UI components"
```

---

### Task 3: Research React Bits Components

**Files:**
- Create: `docs/component-catalogs/react-bits.md`

**Step 1: Visit React Bits and catalog components**

Navigate to https://reactbits.dev/ and document all available components.

**Step 2: Create catalog document**

```markdown
# React Bits Component Catalog

## Visual Effects (10 components)
- GlassmorphismCard - Card with glassmorphism effect
- NeonButton - Neon glow button
- GradientText - Animated gradient text
- AnimatedBorder - Animated border component
- GlitchText - Glitch effect text
- MorphingText - Text morphing animation
- TiltCard - 3D tilt card
- ParallaxCard - Parallax card effect
- HoverCard - Interactive hover card
- ShinyButton - Shiny button effect

## Interactive (8 components)
- FloatingLabel - Floating label input
- AnimatedInput - Animated input field
- RippleButton - Ripple click effect
- MagneticButton - Magnetic hover effect
- SmoothScroll - Smooth scroll component
- RevealText - Text reveal animation
- CountUp - Count-up number animation
- TypeWriter - Typewriter text effect

**Priority: 18 components total**
```

**Step 3: Commit**

```bash
git add docs/component-catalogs/react-bits.md
git commit -m "docs: catalog React Bits components"
```

---

### Task 4: Identify Chakra UI Components to Add

**Files:**
- Create: `docs/component-catalogs/chakra-ui.md`

**Step 1: Create catalog of Chakra components NOT in shadcn**

Focus on components that shadcn/ui doesn't provide.

**Step 2: Create catalog document**

```markdown
# Chakra UI Component Catalog

## Additional Components (12 components)
- Stat - Statistics display
- CircularProgress - Circular progress indicator
- SimpleGrid - Simple responsive grid
- Wrap - Wrapping flex container
- Tag - Tag/label component
- Divider - Visual divider
- Kbd - Keyboard key display
- VisuallyHidden - Screen reader only content
- Portal - Portal rendering
- CloseButton - Close button component
- IconButton - Icon button (different from shadcn)
- NumberInput - Number input with steppers

**Priority: 12 components total**
```

**Step 3: Commit**

```bash
git add docs/component-catalogs/chakra-ui.md
git commit -m "docs: catalog Chakra UI components"
```

---

### Task 5: Identify Material UI Components to Add

**Files:**
- Create: `docs/component-catalogs/material-ui.md`

**Step 1: Create catalog of Material UI components NOT in shadcn**

Focus on advanced data display and unique Material components.

**Step 2: Create catalog document**

```markdown
# Material UI Component Catalog

## Advanced Data Components (10 components)
- DataGrid - Advanced data grid with sorting/filtering
- TreeView - Tree view component
- Timeline - Timeline component (different from Aceternity)
- Stepper - Step progress indicator
- SpeedDial - Speed dial FAB menu
- Rating - Star rating component
- Autocomplete - Autocomplete input
- Pagination - Pagination controls
- Breadcrumbs - Breadcrumb navigation
- ImageList - Masonry image grid

**Priority: 10 components total**
```

**Step 3: Commit**

```bash
git add docs/component-catalogs/material-ui.md
git commit -m "docs: catalog Material UI components"
```

---

## Phase 2: Component Installation & Setup

### Task 6: Install Aceternity UI Dependencies

**Files:**
- Modify: `package.json`
- Create: `src/components/aceternity/README.md`

**Step 1: Check if Aceternity has npm package**

```bash
npm search @aceternity/ui
```

Expected: Likely no package (copy-paste library like shadcn)

**Step 2: Install required dependencies**

Aceternity components typically need: framer-motion, clsx, tailwind-merge

```bash
npm install framer-motion clsx tailwind-merge
```

**Step 3: Create aceternity components directory**

```bash
mkdir -p src/components/aceternity
```

**Step 4: Create README**

```markdown
# Aceternity UI Components

This directory contains components from https://ui.aceternity.com/

Components are copy-pasted and adapted for our schema system.

## Installation

Each component is copied from the Aceternity website and:
1. Adapted to accept props from our schema
2. Wrapped in a component function matching our pattern
3. Registered in the registry with Zod schema
```

**Step 5: Commit**

```bash
git add package.json package-lock.json src/components/aceternity/README.md
git commit -m "feat: install Aceternity UI dependencies and setup directory"
```

---

### Task 7: Install Magic UI Dependencies

**Files:**
- Modify: `package.json`
- Create: `src/components/magicui/README.md`

**Step 1: Check if Magic UI has npm package**

```bash
npm search magic-ui
```

**Step 2: Install if available, otherwise note as copy-paste**

If npm package exists:
```bash
npm install magic-ui
```

Otherwise, install dependencies (framer-motion likely required)

**Step 3: Create magicui components directory**

```bash
mkdir -p src/components/magicui
```

**Step 4: Create README**

```markdown
# Magic UI Components

This directory contains components from https://magicui.design/

## Installation

Components are either imported from npm or copy-pasted.
```

**Step 5: Commit**

```bash
git add package.json package-lock.json src/components/magicui/README.md
git commit -m "feat: install Magic UI dependencies and setup directory"
```

---

### Task 8: Install React Bits Dependencies

**Files:**
- Modify: `package.json`
- Create: `src/components/reactbits/README.md`

**Step 1: Create reactbits components directory**

```bash
mkdir -p src/components/reactbits
```

**Step 2: Install required dependencies**

React Bits components typically use framer-motion (already installed).

**Step 3: Create README**

```markdown
# React Bits Components

This directory contains components from https://reactbits.dev/

## Installation

Components are copy-pasted from the website.
```

**Step 4: Commit**

```bash
git add src/components/reactbits/README.md
git commit -m "feat: setup React Bits directory"
```

---

### Task 9: Install Chakra UI

**Files:**
- Modify: `package.json`

**Step 1: Install Chakra UI**

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled
```

**Step 2: Create directory**

```bash
mkdir -p src/components/chakraui
```

**Step 3: Create README**

```markdown
# Chakra UI Components

This directory contains selected components from Chakra UI.

We import these directly from @chakra-ui/react and wrap them.
```

**Step 4: Commit**

```bash
git add package.json package-lock.json src/components/chakraui/README.md
git commit -m "feat: install Chakra UI dependencies"
```

---

### Task 10: Install Material UI

**Files:**
- Modify: `package.json`

**Step 1: Install Material UI**

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

**Step 2: Create directory**

```bash
mkdir -p src/components/mui
```

**Step 3: Create README**

```markdown
# Material UI Components

This directory contains selected components from Material UI.

We import these from @mui/material and wrap them.
```

**Step 4: Commit**

```bash
git add package.json package-lock.json src/components/mui/README.md
git commit -m "feat: install Material UI dependencies"
```

---

## Phase 3: Add Priority Components (Start Small)

### Task 11: Add First Aceternity Component (3DCard)

**Files:**
- Create: `src/components/aceternity/3d-card.tsx`
- Modify: `src/lib/registry/schemas.ts`
- Modify: `src/lib/registry/components.ts`
- Modify: `src/components/generated/index.tsx`

**Step 1: Copy 3DCard component from Aceternity**

Visit https://ui.aceternity.com/components/3d-card and copy the component code.

**Step 2: Create component file**

```typescript
// src/components/aceternity/3d-card.tsx
"use client";

import { cn } from "@/lib/utils";
import React, { createContext, useState, useContext, useRef, useEffect } from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={cn("flex items-center justify-center", containerClassName)}>
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("flex items-center justify-center relative transition-all duration-200 ease-linear", className)}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]", className)}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Tag>
  );
};

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
```

**Step 3: Add schema to schemas.ts**

```typescript
// In src/lib/registry/schemas.ts
ThreeDCard: z.object({
  className: z.string().optional(),
  containerClassName: z.string().optional(),
  children: z.union([z.string(), nodeArray]).optional(),
}),

ThreeDCardBody: z.object({
  className: z.string().optional(),
  children: z.union([z.string(), nodeArray]).optional(),
}),

ThreeDCardItem: z.object({
  as: z.enum(["div", "p", "h1", "h2", "h3", "button", "a", "img"]).optional(),
  className: z.string().optional(),
  translateX: z.union([z.number(), z.string()]).optional(),
  translateY: z.union([z.number(), z.string()]).optional(),
  translateZ: z.union([z.number(), z.string()]).optional(),
  rotateX: z.union([z.number(), z.string()]).optional(),
  rotateY: z.union([z.number(), z.string()]).optional(),
  rotateZ: z.union([z.number(), z.string()]).optional(),
  children: z.union([z.string(), nodeArray]).optional(),
}),
```

**Step 4: Add to component registry**

```typescript
// In src/lib/registry/components.ts
ThreeDCard: {
  description: "Interactive 3D card container with tilt effect on mouse move. Use with ThreeDCardBody and ThreeDCardItem.",
  category: "display",
  tags: ["3d", "animation", "interactive", "card", "aceternity"],
  allowedChildren: ["ThreeDCardBody"],
},

ThreeDCardBody: {
  description: "Body container for 3D card content. Use inside ThreeDCard.",
  category: "display",
  tags: ["3d", "animation", "card", "aceternity"],
  allowedChildren: ["ThreeDCardItem"],
},

ThreeDCardItem: {
  description: "Individual item inside 3D card that can be transformed in 3D space. Set translateX/Y/Z and rotateX/Y/Z for 3D positioning.",
  category: "display",
  tags: ["3d", "animation", "card", "aceternity"],
  allowedChildren: ["*"],
},
```

**Step 5: Add wrapper component to generated/index.tsx**

```typescript
// In src/components/generated/index.tsx
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";

// In component map
function ThreeDCardComponent({ props, children }: ComponentRendererProps) {
  return (
    <CardContainer
      className={props.className as string}
      containerClassName={props.containerClassName as string}
    >
      {children}
    </CardContainer>
  );
}

function ThreeDCardBodyComponent({ props, children }: ComponentRendererProps) {
  return (
    <CardBody className={props.className as string}>
      {children}
    </CardBody>
  );
}

function ThreeDCardItemComponent({ props, children }: ComponentRendererProps) {
  return (
    <CardItem
      as={props.as as any}
      className={props.className as string}
      translateX={props.translateX as number}
      translateY={props.translateY as number}
      translateZ={props.translateZ as number}
      rotateX={props.rotateX as number}
      rotateY={props.rotateY as number}
      rotateZ={props.rotateZ as number}
    >
      {children}
    </CardItem>
  );
}

// In componentMap
const componentMap: Record<string, React.FC<any>> = {
  // ... existing components
  ThreeDCard: ThreeDCardComponent,
  ThreeDCardBody: ThreeDCardBodyComponent,
  ThreeDCardItem: ThreeDCardItemComponent,
};
```

**Step 6: Add to ComponentName type**

```typescript
// In src/lib/registry/schemas.ts
export type ComponentName =
  | "Flex"
  // ... existing components
  | "ThreeDCard"
  | "ThreeDCardBody"
  | "ThreeDCardItem";
```

**Step 7: Test manually**

Start dev server and test generation with: "Create a 3D card showcasing a product"

```bash
npm run dev
```

Expected: Component renders with 3D tilt effect

**Step 8: Commit**

```bash
git add src/components/aceternity/3d-card.tsx src/lib/registry/schemas.ts src/lib/registry/components.ts src/components/generated/index.tsx
git commit -m "feat: add Aceternity 3DCard component"
```

---

### Task 12: Add Remaining Aceternity Priority Components

**Note:** This task documents the pattern. Repeat for each component.

**Priority Components (34 more):**
1. AuroraBackground
2. WavyBackground
3. Spotlight
4. LampEffect
5. BackgroundGradient
6. BackgroundBeams
7. Meteors
8. Particles
9. GlowingStars
10. ShootingStars
11. FloatingDock
12. Globe
13. AnimatedBeam
14. SparklesCore
15. HeroParallax
16. HeroHighlight
17. TypewriterEffect
18. TextGenerateEffect
19. MovingBorder
20. BentoGrid
21. InfiniteMovingCards
22. CardStack
23. LayoutGrid
24. StickyScroll
25. Timeline
26. Tabs
27. AnimatedTooltip
28. HoverEffect
29. TracingBeam
30. FollowingPointer
31. BackgroundBoxes
32. CanvasRevealEffect
33. CardHoverEffect
34. MultiStepLoader

**Process per component:**
1. Copy component code from Aceternity website
2. Create file in `src/components/aceternity/[component-name].tsx`
3. Add Zod schema to `src/lib/registry/schemas.ts`
4. Add registry entry to `src/lib/registry/components.ts`
5. Add wrapper to `src/components/generated/index.tsx`
6. Add to ComponentName type
7. Test with appropriate prompt
8. Commit: `git commit -m "feat: add Aceternity [ComponentName]"`

**Files:**
- Create: 34 files in `src/components/aceternity/*.tsx`
- Modify: `src/lib/registry/schemas.ts` (add 34 schemas)
- Modify: `src/lib/registry/components.ts` (add 34 registry entries)
- Modify: `src/components/generated/index.tsx` (add 34 wrapper components)

**Estimated time:** 2-3 hours (5 minutes per component)

---

### Task 13: Add Magic UI Priority Components

**Priority Components (20):**
1. AnimatedBeam (might already have from Aceternity)
2. AnimatedGradient
3. BlurFade
4. BorderBeam
5. BoxReveal
6. GradientHeading
7. Meteors (might already have from Aceternity)
8. NumberTicker
9. Particles (might already have from Aceternity)
10. Ripple
11. ShimmerButton
12. WordPullUp
13. Globe (might already have from Aceternity)
14. Marquee
15. OrbitingCircles
16. RetroGrid
17. DotPattern
18. GridPattern
19. Spotlight (might already have from Aceternity)
20. MagicCard

**Process:** Same as Task 12, but for Magic UI components

**Files:**
- Create: ~15-20 files in `src/components/magicui/*.tsx` (some may be duplicates)
- Modify: `src/lib/registry/schemas.ts`
- Modify: `src/lib/registry/components.ts`
- Modify: `src/components/generated/index.tsx`

**Estimated time:** 1.5-2 hours

---

### Task 14: Add React Bits Priority Components

**Priority Components (18):**
1. GlassmorphismCard
2. NeonButton
3. GradientText
4. AnimatedBorder
5. GlitchText
6. MorphingText
7. TiltCard
8. ParallaxCard
9. HoverCard
10. ShinyButton
11. FloatingLabel
12. AnimatedInput
13. RippleButton
14. MagneticButton
15. SmoothScroll
16. RevealText
17. CountUp
18. TypeWriter

**Process:** Same as Task 12

**Files:**
- Create: 18 files in `src/components/reactbits/*.tsx`
- Modify: `src/lib/registry/schemas.ts`
- Modify: `src/lib/registry/components.ts`
- Modify: `src/components/generated/index.tsx`

**Estimated time:** 1.5 hours

---

### Task 15: Add Chakra UI Priority Components

**Priority Components (12):**
1. Stat
2. CircularProgress
3. SimpleGrid
4. Wrap
5. Tag
6. Divider
7. Kbd
8. VisuallyHidden
9. Portal
10. CloseButton
11. IconButton
12. NumberInput

**Step 1: Import from Chakra and wrap**

```typescript
// src/components/chakraui/stat.tsx
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";

export { Stat, StatLabel, StatNumber, StatHelpText };
```

**Step 2: Add wrapper in generated/index.tsx**

```typescript
import { Stat, StatLabel, StatNumber, StatHelpText } from "@/components/chakraui/stat";

function StatComponent({ props, children }: ComponentRendererProps) {
  return <Stat>{children}</Stat>;
}

// Add to componentMap
```

**Process:** Import and wrap each Chakra component

**Files:**
- Create: 12 files in `src/components/chakraui/*.tsx`
- Modify: `src/lib/registry/schemas.ts`
- Modify: `src/lib/registry/components.ts`
- Modify: `src/components/generated/index.tsx`

**Estimated time:** 1 hour

---

### Task 16: Add Material UI Priority Components

**Priority Components (10):**
1. DataGrid (@mui/x-data-grid)
2. TreeView
3. Timeline
4. Stepper
5. SpeedDial
6. Rating
7. Autocomplete
8. Pagination
9. Breadcrumbs
10. ImageList

**Step 1: Install Material UI X for DataGrid**

```bash
npm install @mui/x-data-grid
```

**Step 2: Import and wrap components**

Similar to Chakra UI approach.

**Files:**
- Create: 10 files in `src/components/mui/*.tsx`
- Modify: `src/lib/registry/schemas.ts`
- Modify: `src/lib/registry/components.ts`
- Modify: `src/components/generated/index.tsx`

**Estimated time:** 1 hour

---

## Phase 4: Component Categorization System

### Task 17: Create Component Category Mappings

**Files:**
- Create: `src/lib/registry/category-mappings.ts`

**Step 1: Define category to component mappings**

```typescript
// src/lib/registry/category-mappings.ts

/**
 * Maps UI intent categories to relevant component names.
 * Used by LLM-based component selection to filter registry.
 */

export const categoryMappings = {
  // Page Types
  dashboard: [
    "KPICard", "LineChart", "BarChart", "AreaChart", "PieChart", "RadarChart",
    "DataTable", "StatCard", "Flex", "Grid", "Container", "Section", "Badge"
  ],

  "landing page": [
    "Hero", "FeatureGrid", "Testimonial", "PricingTable", "CTA",
    "LogoCloud", "FAQ", "ContactForm", "Newsletter", "Footer",
    "Container", "Section", "Flex", "Grid"
  ],

  form: [
    "Input", "Select", "Checkbox", "Radio", "Switch", "Slider",
    "DatePicker", "TimePicker", "Textarea", "Button", "Label",
    "Flex", "Grid", "Stack"
  ],

  ecommerce: [
    "ProductCard", "PricingCard", "Badge", "Rating", "Button",
    "Image", "Grid", "Flex", "Section", "Container", "DataTable"
  ],

  blog: [
    "MediaCard", "BlogCard", "Heading", "Text", "Image",
    "Avatar", "Badge", "Grid", "Flex", "Container", "Section"
  ],

  // Visual Styles
  animated: [
    "ThreeDCard", "AnimatedBeam", "Particles", "Meteors", "WavyBackground",
    "AuroraBackground", "TypewriterEffect", "TextGenerateEffect",
    "InfiniteMovingCards", "HoverEffect", "MovingBorder"
  ],

  "3d": [
    "ThreeDCard", "Globe", "CardHoverEffect", "TiltCard", "ParallaxCard"
  ],

  glassmorphism: [
    "GlassmorphismCard", "BackgroundGradient", "BlurFade"
  ],

  neon: [
    "NeonButton", "GlowingStars", "Spotlight", "LampEffect"
  ],

  gradient: [
    "GradientText", "GradientHeading", "AnimatedGradient",
    "BackgroundGradient", "ShimmerButton"
  ],

  // Component Types
  cards: [
    "Card", "ProductCard", "PricingCard", "MediaCard", "BlogCard",
    "ThreeDCard", "GlassmorphismCard", "TiltCard", "MagicCard"
  ],

  buttons: [
    "Button", "NeonButton", "ShimmerButton", "ShinyButton",
    "RippleButton", "MagneticButton", "MovingBorder"
  ],

  charts: [
    "LineChart", "BarChart", "AreaChart", "PieChart", "RadarChart",
    "ScatterChart"
  ],

  data: [
    "DataTable", "DataGrid", "KPICard", "StatCard", "Stat",
    "NumberTicker", "CountUp"
  ],

  navigation: [
    "Tabs", "Breadcrumbs", "Pagination", "FloatingDock",
    "Stepper", "Timeline"
  ],

  backgrounds: [
    "WavyBackground", "AuroraBackground", "BackgroundGradient",
    "BackgroundBeams", "BackgroundBoxes", "RetroGrid", "DotPattern",
    "GridPattern", "GlowingStars", "ShootingStars", "Meteors"
  ],

  text: [
    "Heading", "Text", "GradientText", "GlitchText", "MorphingText",
    "TypewriterEffect", "TextGenerateEffect", "WordPullUp", "RevealText"
  ],

  // Special Effects
  parallax: [
    "HeroParallax", "ParallaxCard", "StickyScroll"
  ],

  hover: [
    "HoverEffect", "CardHoverEffect", "HoverCard", "MagneticButton"
  ],

  scroll: [
    "InfiniteMovingCards", "Marquee", "StickyScroll", "TracingBeam",
    "SmoothScroll"
  ],
} as const;

export type CategoryKey = keyof typeof categoryMappings;

/**
 * Get components for a specific category
 */
export function getComponentsForCategory(category: CategoryKey): string[] {
  return categoryMappings[category] || [];
}

/**
 * Get all unique components from multiple categories
 */
export function getComponentsForCategories(categories: CategoryKey[]): string[] {
  const componentsSet = new Set<string>();

  // Always include core layout components
  const coreComponents = ["Flex", "Grid", "Container", "Section", "Stack"];
  coreComponents.forEach(c => componentsSet.add(c));

  // Add components from selected categories
  categories.forEach(category => {
    const components = getComponentsForCategory(category);
    components.forEach(c => componentsSet.add(c));
  });

  return Array.from(componentsSet);
}

/**
 * Get all category keys (for LLM prompt)
 */
export function getAllCategoryKeys(): CategoryKey[] {
  return Object.keys(categoryMappings) as CategoryKey[];
}
```

**Step 2: Export from registry index**

```typescript
// Modify src/lib/registry/index.ts if it exists
export * from './category-mappings';
```

**Step 3: Commit**

```bash
git add src/lib/registry/category-mappings.ts
git commit -m "feat: add component category mappings for LLM selection"
```

---

## Phase 5: LLM-Based Component Selection

### Task 18: Create Component Selection Module

**Files:**
- Create: `src/lib/generation/component-selection.ts`

**Step 1: Create selection prompt builder**

```typescript
// src/lib/generation/component-selection.ts
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { getAllCategoryKeys, getComponentsForCategories, type CategoryKey } from "@/lib/registry/category-mappings";

/**
 * Analyzes user prompt and selects relevant component categories.
 * Uses Claude Haiku for fast, cheap component filtering.
 */
export async function selectRelevantComponents(
  userPrompt: string
): Promise<string[]> {
  const categories = getAllCategoryKeys();

  const selectionPrompt = `You are a UI component selector. Analyze the user's request and determine which component categories are relevant.

User request: "${userPrompt}"

Available categories:
${categories.map(c => `- ${c}`).join('\n')}

Instructions:
1. Identify the type of UI being requested (dashboard, landing page, form, blog, etc.)
2. Identify any visual styles mentioned (animated, 3d, glassmorphism, neon, gradient, etc.)
3. Identify specific component types needed (cards, buttons, charts, data, navigation, backgrounds, text, etc.)
4. Return ONLY the category names that are relevant, comma-separated
5. Be selective - only include categories that are actually needed

Examples:
- "animated landing page for SaaS" → landing page, animated, gradient, buttons, text
- "dashboard with charts" → dashboard, charts, data
- "3D product showcase" → 3d, cards, animated, hover
- "simple contact form" → form

Return ONLY the category names (comma-separated), nothing else:`;

  try {
    const response = await generateText({
      model: anthropic("claude-3-5-haiku-20241022"), // Fast, cheap model
      prompt: selectionPrompt,
      maxTokens: 100,
    });

    const selectedCategories = response.text
      .split(',')
      .map(c => c.trim())
      .filter(c => categories.includes(c as CategoryKey)) as CategoryKey[];

    // Get unique components from selected categories
    const components = getComponentsForCategories(selectedCategories);

    console.log(`[Component Selection] Selected ${selectedCategories.length} categories, ${components.length} components`);

    return components;
  } catch (error) {
    console.error('[Component Selection] Error selecting components:', error);

    // Fallback: return all components if selection fails
    return [];
  }
}

/**
 * Get components with fallback to all components if selection is empty
 */
export function getComponentsWithFallback(
  selectedComponents: string[],
  allComponents: string[]
): string[] {
  if (selectedComponents.length === 0) {
    console.warn('[Component Selection] No components selected, using all components');
    return allComponents;
  }

  return selectedComponents;
}
```

**Step 2: Add environment variable check**

In `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

**Step 3: Commit**

```bash
git add src/lib/generation/component-selection.ts
git commit -m "feat: add LLM-based component selection"
```

---

### Task 19: Integrate Selection into Generation Engine

**Files:**
- Modify: `src/lib/generation/engine.ts`

**Step 1: Import component selection**

```typescript
// In src/lib/generation/engine.ts
import { selectRelevantComponents, getComponentsWithFallback } from "./component-selection";
import { getAllComponentNames } from "@/lib/registry/components";
```

**Step 2: Modify generateUI function**

```typescript
// Find the generateUI function and modify it
export async function generateUI(
  request: GenerationRequest
): Promise<GenerationResult> {
  const provider = getAvailableProvider();

  if (!provider) {
    console.log("No AI provider available, using demo fallback");
    return { schema: getDemoSchema(), metadata: getDemoMetadata() };
  }

  try {
    // NEW: Select relevant components based on prompt
    const startTime = Date.now();
    const selectedComponents = await selectRelevantComponents(request.prompt);
    const selectionTime = Date.now() - startTime;

    console.log(`[Generation] Component selection took ${selectionTime}ms`);
    console.log(`[Generation] Selected ${selectedComponents.length} components`);

    // Get all components as fallback
    const allComponents = getAllComponentNames();
    const componentsToUse = getComponentsWithFallback(selectedComponents, allComponents);

    // Update constraints to use filtered components
    const updatedConstraints = {
      ...request.constraints,
      allowedComponents: componentsToUse,
    };

    // Build system prompt with filtered components
    const systemPrompt = buildSystemPrompt(
      updatedConstraints,
      request.theme as ThemeConfig,
      request.styleHint
    );

    // Rest of generation logic stays the same...
    const { text } = await generateText({
      model: provider.model,
      system: systemPrompt,
      prompt: buildUserPrompt(request),
      maxTokens: 4000,
    });

    const schema = parseSchemaResponse(text);

    // Add selection metadata
    const metadata: GenerationMetadata = {
      provider: provider.name,
      model: provider.modelId,
      timestamp: new Date().toISOString(),
      tokensUsed: 0, // TODO: get from response
      componentsUsed: extractComponentsUsed(schema),
      generationTime: Date.now() - startTime,
      // NEW: Add selection metrics
      componentSelectionTime: selectionTime,
      totalComponents: allComponents.length,
      selectedComponents: componentsToUse.length,
    };

    return { schema, metadata };
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
}
```

**Step 3: Update GenerationMetadata type**

```typescript
// In src/types/index.ts
export interface GenerationMetadata {
  provider: string;
  model: string;
  timestamp: string;
  tokensUsed?: number;
  componentsUsed: string[];
  generationTime?: number;
  // NEW: Component selection metrics
  componentSelectionTime?: number;
  totalComponents?: number;
  selectedComponents?: number;
}
```

**Step 4: Test the integration**

```bash
npm run dev
```

Test with prompt: "Create an animated landing page"

Expected console output:
```
[Component Selection] Selected 4 categories, 45 components
[Generation] Component selection took 523ms
[Generation] Selected 45 components
```

**Step 5: Commit**

```bash
git add src/lib/generation/engine.ts src/types/index.ts
git commit -m "feat: integrate LLM component selection into generation engine"
```

---

### Task 20: Add Selection Caching

**Files:**
- Create: `src/lib/generation/selection-cache.ts`
- Modify: `src/lib/generation/component-selection.ts`

**Step 1: Create simple in-memory cache**

```typescript
// src/lib/generation/selection-cache.ts

interface CacheEntry {
  components: string[];
  timestamp: number;
}

// Simple in-memory cache (resets on server restart)
const cache = new Map<string, CacheEntry>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached component selection
 */
export function getCachedSelection(prompt: string): string[] | null {
  const cacheKey = prompt.toLowerCase().trim();
  const entry = cache.get(cacheKey);

  if (!entry) return null;

  // Check if cache entry is expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(cacheKey);
    return null;
  }

  return entry.components;
}

/**
 * Cache component selection
 */
export function cacheSelection(prompt: string, components: string[]): void {
  const cacheKey = prompt.toLowerCase().trim();
  cache.set(cacheKey, {
    components,
    timestamp: Date.now(),
  });
}

/**
 * Clear cache (for testing)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
}
```

**Step 2: Update component-selection.ts to use cache**

```typescript
// Modify src/lib/generation/component-selection.ts
import { getCachedSelection, cacheSelection } from "./selection-cache";

export async function selectRelevantComponents(
  userPrompt: string
): Promise<string[]> {
  // Check cache first
  const cached = getCachedSelection(userPrompt);
  if (cached) {
    console.log(`[Component Selection] Cache hit for prompt: "${userPrompt.slice(0, 50)}..."`);
    return cached;
  }

  const categories = getAllCategoryKeys();

  // ... rest of selection logic ...

  // Cache the result before returning
  cacheSelection(userPrompt, components);

  return components;
}
```

**Step 3: Commit**

```bash
git add src/lib/generation/selection-cache.ts src/lib/generation/component-selection.ts
git commit -m "feat: add caching for component selection"
```

---

## Phase 6: Testing and Optimization

### Task 21: Create Test Prompts

**Files:**
- Create: `docs/testing/component-selection-tests.md`

**Step 1: Document test cases**

```markdown
# Component Selection Test Cases

## Test 1: Dashboard
**Prompt:** "Create a sales dashboard with charts and KPI cards"

**Expected Categories:** dashboard, charts, data

**Expected Components:** Should include KPICard, LineChart, BarChart, DataTable, Grid, Flex

**Token Savings:** ~30-40k tokens (from 150 components to ~40)

---

## Test 2: Animated Landing Page
**Prompt:** "Build an animated landing page for a SaaS product with 3D effects"

**Expected Categories:** landing page, animated, 3d, gradient

**Expected Components:** Hero, FeatureGrid, ThreeDCard, AnimatedBeam, WavyBackground

**Token Savings:** ~35k tokens (from 150 to ~50)

---

## Test 3: Simple Form
**Prompt:** "Contact form with name, email, and message"

**Expected Categories:** form

**Expected Components:** Input, Textarea, Button, Label, Flex, Stack

**Token Savings:** ~40k tokens (from 150 to ~25)

---

## Test 4: E-commerce Product Page
**Prompt:** "Product showcase page with image gallery and pricing"

**Expected Categories:** ecommerce, cards

**Expected Components:** ProductCard, Image, Grid, Button, Badge, Rating

**Token Savings:** ~35k tokens

---

## Test 5: Blog Layout
**Prompt:** "Blog homepage with article cards"

**Expected Categories:** blog, cards

**Expected Components:** MediaCard, BlogCard, Grid, Image, Avatar, Badge

**Token Savings:** ~35k tokens

---

## Performance Benchmarks

**Target Metrics:**
- Component selection time: < 1 second
- Total generation time: < 5 seconds
- Token reduction: > 60%
- Cache hit rate: > 30% for repeated prompts

**Actual Results:** (Fill in after testing)
- Avg selection time: ___ms
- Avg generation time: ___ms
- Avg token reduction: ___%
- Cache hit rate: ___%
```

**Step 2: Commit**

```bash
git add docs/testing/component-selection-tests.md
git commit -m "docs: add component selection test cases"
```

---

### Task 22: Add Telemetry Logging

**Files:**
- Create: `src/lib/generation/telemetry.ts`
- Modify: `src/lib/generation/component-selection.ts`

**Step 1: Create telemetry logger**

```typescript
// src/lib/generation/telemetry.ts

export interface SelectionTelemetry {
  prompt: string;
  promptLength: number;
  selectedCategories: string[];
  selectedComponentCount: number;
  totalComponentCount: number;
  selectionTime: number;
  cacheHit: boolean;
  timestamp: string;
}

const telemetryLog: SelectionTelemetry[] = [];

export function logSelection(telemetry: SelectionTelemetry): void {
  telemetryLog.push(telemetry);

  // Keep only last 100 entries
  if (telemetryLog.length > 100) {
    telemetryLog.shift();
  }

  // Log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Telemetry]', {
      prompt: telemetry.prompt.slice(0, 50),
      components: `${telemetry.selectedComponentCount}/${telemetry.totalComponentCount}`,
      time: `${telemetry.selectionTime}ms`,
      cached: telemetry.cacheHit,
    });
  }
}

export function getTelemetry(): SelectionTelemetry[] {
  return telemetryLog;
}

export function getAverageMetrics() {
  if (telemetryLog.length === 0) return null;

  const avg = {
    avgSelectionTime: 0,
    avgSelectedComponents: 0,
    cacheHitRate: 0,
    totalRequests: telemetryLog.length,
  };

  let cacheHits = 0;

  telemetryLog.forEach(entry => {
    avg.avgSelectionTime += entry.selectionTime;
    avg.avgSelectedComponents += entry.selectedComponentCount;
    if (entry.cacheHit) cacheHits++;
  });

  avg.avgSelectionTime /= telemetryLog.length;
  avg.avgSelectedComponents /= telemetryLog.length;
  avg.cacheHitRate = (cacheHits / telemetryLog.length) * 100;

  return avg;
}
```

**Step 2: Add telemetry to component selection**

```typescript
// Modify src/lib/generation/component-selection.ts
import { logSelection } from "./telemetry";

export async function selectRelevantComponents(
  userPrompt: string
): Promise<string[]> {
  const startTime = Date.now();
  const allComponents = getAllComponentNames();

  // Check cache first
  const cached = getCachedSelection(userPrompt);
  if (cached) {
    const selectionTime = Date.now() - startTime;

    logSelection({
      prompt: userPrompt,
      promptLength: userPrompt.length,
      selectedCategories: [], // Not available from cache
      selectedComponentCount: cached.length,
      totalComponentCount: allComponents.length,
      selectionTime,
      cacheHit: true,
      timestamp: new Date().toISOString(),
    });

    return cached;
  }

  // ... selection logic ...

  const selectionTime = Date.now() - startTime;

  logSelection({
    prompt: userPrompt,
    promptLength: userPrompt.length,
    selectedCategories,
    selectedComponentCount: components.length,
    totalComponentCount: allComponents.length,
    selectionTime,
    cacheHit: false,
    timestamp: new Date().toISOString(),
  });

  return components;
}
```

**Step 3: Add telemetry API endpoint (optional)**

```typescript
// Create src/app/api/telemetry/route.ts
import { NextResponse } from "next/server";
import { getAverageMetrics, getTelemetry } from "@/lib/generation/telemetry";

export async function GET() {
  const metrics = getAverageMetrics();
  const recentLogs = getTelemetry().slice(-20); // Last 20 entries

  return NextResponse.json({
    metrics,
    recentLogs,
  });
}
```

**Step 4: Commit**

```bash
git add src/lib/generation/telemetry.ts src/lib/generation/component-selection.ts src/app/api/telemetry/route.ts
git commit -m "feat: add telemetry logging for component selection"
```

---

## Phase 7: Documentation and Finalization

### Task 23: Update Main Documentation

**Files:**
- Modify: `README.md`
- Create: `docs/architecture/component-selection.md`

**Step 1: Document the architecture**

```markdown
# Intelligent Component Selection Architecture

## Overview

The UI generator uses a two-stage LLM approach to efficiently handle 150+ components while maintaining manageable token budgets.

## How It Works

### Stage 1: Component Selection (Fast & Cheap)
- **Model:** Claude Haiku 3.5
- **Input:** User prompt
- **Output:** Relevant component categories
- **Time:** ~500ms
- **Cost:** ~$0.0001 per request

### Stage 2: UI Generation (Powerful)
- **Model:** Claude Sonnet 4.5
- **Input:** User prompt + filtered component registry (30-50 components)
- **Output:** React Interface Schema
- **Time:** ~3-5 seconds
- **Cost:** Standard generation cost

## Token Savings

**Without Selection:**
- System prompt: ~50k tokens (150 components)
- User prompt: ~500 tokens
- Total input: ~50.5k tokens

**With Selection:**
- Selection request: ~1k tokens (Haiku)
- System prompt: ~15k tokens (40 components)
- User prompt: ~500 tokens
- Total input: ~16.5k tokens

**Savings:** ~34k tokens per generation (67% reduction)

## Component Categories

Components are organized into categories:
- Page types: dashboard, landing page, form, ecommerce, blog
- Visual styles: animated, 3d, glassmorphism, neon, gradient
- Component types: cards, buttons, charts, data, navigation, backgrounds, text
- Effects: parallax, hover, scroll

## Caching

Component selections are cached for 5 minutes to improve performance for repeated prompts.

## Fallback Strategy

If component selection fails or returns no components, the system falls back to using all available components.

## Telemetry

Selection performance is logged for monitoring:
- Selection time
- Components selected
- Cache hit rate
- Token savings
```

**Step 2: Update README**

Add section to README.md about intelligent component selection.

**Step 3: Commit**

```bash
git add docs/architecture/component-selection.md README.md
git commit -m "docs: document intelligent component selection architecture"
```

---

### Task 24: Create Migration Guide

**Files:**
- Create: `docs/migration/component-selection-migration.md`

**Step 1: Document what changed**

```markdown
# Component Selection Migration Guide

## What Changed

**Before:**
- System sent all 100+ components to LLM on every generation
- High token usage (~40-50k tokens per request)
- Limited ability to scale beyond 100 components

**After:**
- Two-stage LLM selection filters components based on user intent
- Reduced token usage (~15-25k tokens per request)
- Support for 150+ components with room to grow

## Breaking Changes

**None!** This is a backward-compatible enhancement.

## New Features

1. **Intelligent component filtering** - Only relevant components sent to generation LLM
2. **Extended component library** - Added 80+ new components from:
   - Aceternity UI (35 components)
   - Magic UI (20 components)
   - React Bits (18 components)
   - Chakra UI (12 components)
   - Material UI (10 components)

3. **Performance improvements**:
   - 67% token reduction
   - Faster generation times
   - Caching for repeated prompts

4. **New telemetry** - Track selection performance and component usage

## For Developers

### New API

No changes to public API! Selection happens automatically in `generateUI()`.

### Telemetry Endpoint

Access selection metrics:
```
GET /api/telemetry
```

Returns:
```json
{
  "metrics": {
    "avgSelectionTime": 523,
    "avgSelectedComponents": 42,
    "cacheHitRate": 34.5,
    "totalRequests": 127
  },
  "recentLogs": [...]
}
```

### Environment Variables

Ensure `ANTHROPIC_API_KEY` is set for component selection to work.

## Rollback

To disable component selection and revert to old behavior:

```typescript
// In src/lib/generation/engine.ts
// Comment out this line:
const selectedComponents = await selectRelevantComponents(request.prompt);

// And use all components:
const componentsToUse = getAllComponentNames();
```
```

**Step 2: Commit**

```bash
git add docs/migration/component-selection-migration.md
git commit -m "docs: add migration guide for component selection"
```

---

## Summary

This plan implements:

1. ✅ **Component Library Integration** - Add 80+ components from 5 new libraries (Aceternity, Magic UI, React Bits, Chakra, Material UI)

2. ✅ **Intelligent Component Selection** - Two-stage LLM approach:
   - Stage 1: Haiku analyzes prompt → selects categories (~500ms, $0.0001)
   - Stage 2: Sonnet generates UI with filtered components (~3-5s)

3. ✅ **Token Optimization** - Reduce from 50k to 15-25k tokens (60-70% reduction)

4. ✅ **Caching** - Cache selections for 5 minutes to improve repeated prompt performance

5. ✅ **Telemetry** - Track selection performance, component usage, cache hit rates

6. ✅ **Testing** - Comprehensive test cases for different UI types

7. ✅ **Documentation** - Architecture docs, migration guide, test cases

**Total Implementation Time:** 8-12 hours
- Phase 1-2: 2 hours (research + setup)
- Phase 3: 5-7 hours (add all components)
- Phase 4-5: 2-3 hours (selection system)
- Phase 6-7: 1-2 hours (testing + docs)

**Next Steps After Plan Approval:**
1. Create git worktree for implementation
2. Execute tasks in order
3. Commit frequently (after each task)
4. Test at milestones
5. Review before merging
