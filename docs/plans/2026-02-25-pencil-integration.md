# Pencil.dev Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a two-layer UI builder where Pencil.dev handles the visual design canvas and our component registry handles production React code extraction.

**Architecture:** A Claude Code skill (`pencil-ui-builder`) orchestrates Pencil.dev MCP tools to generate a design file annotated with component names from our registry. A second skill (`pencil-extract-code`) reads those annotations and produces production React component code. TypeScript modules in `src/lib/pencil/` handle annotation parsing and schema building.

**Tech Stack:** Pencil.dev MCP tools (batch_design, batch_get, get_style_guide, get_screenshot), existing component registry (`src/lib/registry/components.ts`), existing schema types (`@/types`), Vitest for tests.

---

## Overview: The Annotation Bridge

Every Pencil.dev node gets a name like `[ComponentName] Section Label`.
Example: `[GalaxyBackground] Page Background`, `[HeroSection] Main Hero`, `[GlowCard] Feature 1`.

The bracket prefix is the registry key. This is the bridge between design and code.

---

### Task 1: Component Visual Specs Module

Map our 30 most important registry components to their visual Pencil.dev representation. This is what guides the LLM when it generates batch_design operations.

**Files:**
- Create: `src/lib/pencil/component-specs.ts`
- Create: `src/lib/pencil/__tests__/component-specs.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/pencil/__tests__/component-specs.test.ts
import { describe, it, expect } from 'vitest'
import { getComponentSpec, COMPONENT_SPECS, type ComponentSpec } from '../component-specs'

describe('getComponentSpec', () => {
  it('returns spec for known component', () => {
    const spec = getComponentSpec('GlowCard')
    expect(spec).toBeDefined()
    expect(spec!.pencilType).toBe('frame')
    expect(spec!.visualDescription).toBeTruthy()
    expect(spec!.suggestedWidth).toBeGreaterThan(0)
    expect(spec!.suggestedHeight).toBeGreaterThan(0)
  })

  it('returns undefined for unknown component', () => {
    expect(getComponentSpec('NonExistent')).toBeUndefined()
  })

  it('covers at least 25 components', () => {
    expect(Object.keys(COMPONENT_SPECS).length).toBeGreaterThanOrEqual(25)
  })

  it('all background components have isFullWidth=true', () => {
    const backgrounds = Object.entries(COMPONENT_SPECS)
      .filter(([name]) => name.includes('Background'))
    backgrounds.forEach(([name, spec]) => {
      expect(spec.isFullWidth, `${name} should be full width`).toBe(true)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd /Users/shashanksaxena/Documents/Personal/Code/ui-generator
npx vitest run src/lib/pencil/__tests__/component-specs.test.ts
```
Expected: FAIL — module not found.

**Step 3: Implement the module**

```typescript
// src/lib/pencil/component-specs.ts

export interface ComponentSpec {
  pencilType: 'frame' | 'text' | 'shape'
  visualDescription: string   // Describes what to draw in Pencil.dev
  suggestedWidth: number      // In pixels (for a 1440px canvas)
  suggestedHeight: number
  isFullWidth: boolean        // True for backgrounds, navbars, hero sections
  isBackground: boolean       // True for page-level background components
  defaultBg?: string          // Hex color for the Pencil frame background
  pencilNotes: string         // Hints for the LLM when generating batch_design ops
}

export const COMPONENT_SPECS: Record<string, ComponentSpec> = {
  // --- BACKGROUNDS ---
  GalaxyBackground: {
    pencilType: 'frame',
    visualDescription: 'Deep space dark background with subtle star particles and nebula gradients',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#050510',
    pencilNotes: 'Use as the root page frame. Dark navy/black fill. Add small white dots for stars.',
  },
  HyperspeedBackground: {
    pencilType: 'frame',
    visualDescription: 'Dark background with streaking light trails suggesting high-speed motion',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#000008',
    pencilNotes: 'Dark base. Add diagonal light streaks radiating from center.',
  },
  IridescenceBackground: {
    pencilType: 'frame',
    visualDescription: 'Shimmering iridescent gradient shifting through purple, teal, and gold tones',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#1a0533',
    pencilNotes: 'Dark with gradient overlay. Purple to teal diagonal gradient.',
  },
  FloatingLinesBackground: {
    pencilType: 'frame',
    visualDescription: 'Abstract floating geometric lines on dark background',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#0a0a1a',
    pencilNotes: 'Dark background. Thin diagonal lines floating across the frame.',
  },
  LiquidEtherBackground: {
    pencilType: 'frame',
    visualDescription: 'Fluid liquid-like gradient blobs flowing across a dark background',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#060618',
    pencilNotes: 'Dark bg with large soft blob shapes in deep purple and blue.',
  },

  // --- NAVIGATION ---
  Navbar: {
    pencilType: 'frame',
    visualDescription: 'Horizontal navigation bar with logo left, links center, CTA button right',
    suggestedWidth: 1440, suggestedHeight: 72,
    isFullWidth: true, isBackground: false,
    defaultBg: 'transparent',
    pencilNotes: 'Full-width horizontal frame at top. Logo on left, nav links in center, button on right.',
  },
  DockNav: {
    pencilType: 'frame',
    visualDescription: 'macOS-style dock navigation bar floating at the bottom of the screen',
    suggestedWidth: 400, suggestedHeight: 64,
    isFullWidth: false, isBackground: false,
    defaultBg: 'rgba(255,255,255,0.1)',
    pencilNotes: 'Centered floating pill at bottom. Frosted glass look. Icons inside.',
  },
  PillNav: {
    pencilType: 'frame',
    visualDescription: 'Pill-shaped floating navigation with tab links',
    suggestedWidth: 320, suggestedHeight: 48,
    isFullWidth: false, isBackground: false,
    defaultBg: 'rgba(255,255,255,0.15)',
    pencilNotes: 'Centered pill shape. Rounded corners. Nav links as tabs inside.',
  },

  // --- HERO SECTIONS ---
  HeroSection: {
    pencilType: 'frame',
    visualDescription: 'Full-width hero with large heading, subheading, and two CTA buttons centered',
    suggestedWidth: 1440, suggestedHeight: 600,
    isFullWidth: true, isBackground: false,
    defaultBg: 'transparent',
    pencilNotes: 'Center-aligned. Title ~72px bold. Subtitle ~24px. Two buttons below.',
  },

  // --- CARDS ---
  GlowCard: {
    pencilType: 'frame',
    visualDescription: 'Dark card with glowing colored border that intensifies on hover',
    suggestedWidth: 320, suggestedHeight: 240,
    isFullWidth: false, isBackground: false,
    defaultBg: '#111827',
    pencilNotes: 'Rounded dark card. Colored glow border (purple/blue). Title + body inside.',
  },
  SpotlightCard: {
    pencilType: 'frame',
    visualDescription: 'Card with interactive spotlight/radial gradient that follows cursor',
    suggestedWidth: 320, suggestedHeight: 240,
    isFullWidth: false, isBackground: false,
    defaultBg: '#0f0f0f',
    pencilNotes: 'Dark card. Soft radial gradient spotlight at top-center. Title + content.',
  },
  MagicBento: {
    pencilType: 'frame',
    visualDescription: 'Bento grid layout with mixed-size feature cards in a mosaic pattern',
    suggestedWidth: 960, suggestedHeight: 480,
    isFullWidth: false, isBackground: false,
    defaultBg: '#0a0a0a',
    pencilNotes: 'Grid of 4-6 cards with varying sizes. Some tall, some wide. Dark cards.',
  },

  // --- TEXT EFFECTS ---
  DecryptedText: {
    pencilType: 'text',
    visualDescription: 'Text that appears to decrypt/reveal character by character with a glitch effect',
    suggestedWidth: 400, suggestedHeight: 60,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Standalone text element. Monospace font preferred. Show as revealed text.',
  },
  ShinyText: {
    pencilType: 'text',
    visualDescription: 'Text with an animated shimmer/shine effect sweeping across',
    suggestedWidth: 300, suggestedHeight: 48,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Text with gradient overlay suggestion. Can be used for labels or subheadings.',
  },
  FuzzyText: {
    pencilType: 'text',
    visualDescription: 'Text with a soft fuzzy blur effect creating a dreamy appearance',
    suggestedWidth: 400, suggestedHeight: 80,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Large text with blur/fuzz effect. Good for hero headings.',
  },
  SplitText: {
    pencilType: 'text',
    visualDescription: 'Text that animates in with each word or letter splitting from a central axis',
    suggestedWidth: 600, suggestedHeight: 80,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Animated entry text. Use for section headings or hero titles.',
  },
  ScrollReveal: {
    pencilType: 'frame',
    visualDescription: 'Text or content that reveals itself as the user scrolls down the page',
    suggestedWidth: 800, suggestedHeight: 200,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Wrapper frame. Content inside reveals on scroll. Use for paragraph text.',
  },

  // --- BORDERS & EFFECTS ---
  ElectricBorder: {
    pencilType: 'frame',
    visualDescription: 'Element wrapped with an animated electric/lightning border effect',
    suggestedWidth: 400, suggestedHeight: 200,
    isFullWidth: false, isBackground: false,
    defaultBg: '#0a0a0a',
    pencilNotes: 'Wrapper frame. Animated electric border around any content. Dark fill.',
  },
  ShapeBlur: {
    pencilType: 'shape',
    visualDescription: 'Abstract blurred shape/blob that adds ambient color to a section',
    suggestedWidth: 400, suggestedHeight: 400,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Soft blurred shape. Use as decorative background accent behind content.',
  },

  // --- CURSORS ---
  SplashCursor: {
    pencilType: 'shape',
    visualDescription: 'Custom cursor with water ripple splash effect on click',
    suggestedWidth: 48, suggestedHeight: 48,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Small cursor indicator. Used as a page-level interaction effect.',
  },
  TargetCursor: {
    pencilType: 'shape',
    visualDescription: 'Custom target/crosshair cursor that follows the mouse',
    suggestedWidth: 32, suggestedHeight: 32,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Small circular target cursor. Decorative mouse interaction.',
  },

  // --- GALLERIES & GRIDS ---
  MasonryGrid: {
    pencilType: 'frame',
    visualDescription: 'Pinterest-style masonry grid with varying height image cards',
    suggestedWidth: 960, suggestedHeight: 600,
    isFullWidth: false, isBackground: false,
    defaultBg: 'transparent',
    pencilNotes: 'Multi-column layout with cards of varying heights. Image-heavy.',
  },
  CircularGallery: {
    pencilType: 'frame',
    visualDescription: 'Gallery items arranged in a circular/arc pattern',
    suggestedWidth: 600, suggestedHeight: 600,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Circular arrangement of image/card items.',
  },

  // --- LAYOUT ---
  Flex: {
    pencilType: 'frame',
    visualDescription: 'Flexbox layout container for rows or columns',
    suggestedWidth: 960, suggestedHeight: 80,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Generic layout wrapper. Auto-layout in Pencil.dev.',
  },
  Grid: {
    pencilType: 'frame',
    visualDescription: 'CSS grid layout with configurable columns',
    suggestedWidth: 960, suggestedHeight: 400,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Multi-column grid wrapper. Use for card grids.',
  },
  Section: {
    pencilType: 'frame',
    visualDescription: 'Page section with title, description, and content area',
    suggestedWidth: 1440, suggestedHeight: 400,
    isFullWidth: true, isBackground: false,
    pencilNotes: 'Full-width section. Title + subtitle at top, content below.',
  },

  // --- MISC ---
  LogoLoop: {
    pencilType: 'frame',
    visualDescription: 'Horizontal scrolling marquee of company/brand logos',
    suggestedWidth: 1440, suggestedHeight: 80,
    isFullWidth: true, isBackground: false,
    pencilNotes: 'Full-width horizontal scrolling logos strip.',
  },
  LaserFlow: {
    pencilType: 'frame',
    visualDescription: 'Animated laser beam flow effect for decorative sections',
    suggestedWidth: 1440, suggestedHeight: 300,
    isFullWidth: true, isBackground: false,
    pencilNotes: 'Decorative section with flowing laser/neon lines.',
  },
}

export function getComponentSpec(componentName: string): ComponentSpec | undefined {
  return COMPONENT_SPECS[componentName]
}

export function getBackgroundComponents(): string[] {
  return Object.entries(COMPONENT_SPECS)
    .filter(([, spec]) => spec.isBackground)
    .map(([name]) => name)
}

export function getFullWidthComponents(): string[] {
  return Object.entries(COMPONENT_SPECS)
    .filter(([, spec]) => spec.isFullWidth)
    .map(([name]) => name)
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/pencil/__tests__/component-specs.test.ts
```
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/lib/pencil/component-specs.ts src/lib/pencil/__tests__/component-specs.test.ts
git commit -m "feat(pencil): add component visual specs for Pencil.dev design generation"
```

---

### Task 2: Annotation Parser

Parse `[ComponentName] Label` node names from Pencil.dev's batch_get results into structured component references.

**Files:**
- Create: `src/lib/pencil/annotation-parser.ts`
- Create: `src/lib/pencil/__tests__/annotation-parser.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/pencil/__tests__/annotation-parser.test.ts
import { describe, it, expect } from 'vitest'
import {
  parseAnnotation,
  parseNodeTree,
  isAnnotated,
  type AnnotatedNode,
} from '../annotation-parser'

describe('parseAnnotation', () => {
  it('parses [ComponentName] Label format', () => {
    const result = parseAnnotation('[GlowCard] Feature 1')
    expect(result).toEqual({ componentName: 'GlowCard', label: 'Feature 1' })
  })

  it('parses component name with no label', () => {
    const result = parseAnnotation('[GalaxyBackground]')
    expect(result).toEqual({ componentName: 'GalaxyBackground', label: '' })
  })

  it('returns null for unannotated names', () => {
    expect(parseAnnotation('Just a frame')).toBeNull()
    expect(parseAnnotation('Frame 1')).toBeNull()
    expect(parseAnnotation('')).toBeNull()
  })

  it('handles extra whitespace', () => {
    const result = parseAnnotation('[HeroSection]  Hero Content ')
    expect(result?.componentName).toBe('HeroSection')
    expect(result?.label).toBe('Hero Content')
  })
})

describe('isAnnotated', () => {
  it('returns true for annotated node names', () => {
    expect(isAnnotated('[GlowCard] Feature')).toBe(true)
    expect(isAnnotated('[GalaxyBackground]')).toBe(true)
  })
  it('returns false for plain names', () => {
    expect(isAnnotated('Frame 1')).toBe(false)
    expect(isAnnotated('')).toBe(false)
  })
})

describe('parseNodeTree', () => {
  it('extracts all annotated nodes from a flat list', () => {
    const nodes = [
      { id: '1', name: '[GalaxyBackground] Page', children: [] },
      { id: '2', name: 'Some frame', children: [] },
      { id: '3', name: '[HeroSection] Main Hero', children: [] },
      { id: '4', name: '[GlowCard] Feature 1', children: [] },
      { id: '5', name: '[GlowCard] Feature 2', children: [] },
    ]
    const result = parseNodeTree(nodes)
    expect(result).toHaveLength(4)
    expect(result[0].componentName).toBe('GalaxyBackground')
    expect(result[2].componentName).toBe('GlowCard')
    expect(result[2].label).toBe('Feature 1')
    expect(result[3].label).toBe('Feature 2')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/pencil/__tests__/annotation-parser.test.ts
```
Expected: FAIL — module not found.

**Step 3: Implement**

```typescript
// src/lib/pencil/annotation-parser.ts

const ANNOTATION_REGEX = /^\[([A-Za-z][A-Za-z0-9]*)\]\s*(.*)/

export interface ParsedAnnotation {
  componentName: string
  label: string
}

export interface AnnotatedNode {
  id: string
  componentName: string
  label: string
  rawName: string
  children: AnnotatedNode[]
}

export function parseAnnotation(nodeName: string): ParsedAnnotation | null {
  const match = nodeName.trim().match(ANNOTATION_REGEX)
  if (!match) return null
  return {
    componentName: match[1],
    label: match[2].trim(),
  }
}

export function isAnnotated(nodeName: string): boolean {
  return ANNOTATION_REGEX.test(nodeName.trim())
}

interface RawNode {
  id: string
  name: string
  children?: RawNode[]
}

export function parseNodeTree(nodes: RawNode[]): AnnotatedNode[] {
  const result: AnnotatedNode[] = []

  function walk(node: RawNode): void {
    const parsed = parseAnnotation(node.name)
    if (parsed) {
      const annotatedChildren: AnnotatedNode[] = []
      for (const child of node.children ?? []) {
        const childParsed = parseAnnotation(child.name)
        if (childParsed) {
          annotatedChildren.push({
            id: child.id,
            componentName: childParsed.componentName,
            label: childParsed.label,
            rawName: child.name,
            children: [],
          })
        }
      }
      result.push({
        id: node.id,
        componentName: parsed.componentName,
        label: parsed.label,
        rawName: node.name,
        children: annotatedChildren,
      })
    }
    for (const child of node.children ?? []) {
      walk(child)
    }
  }

  for (const node of nodes) walk(node)
  return result
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/pencil/__tests__/annotation-parser.test.ts
```
Expected: PASS (7 tests)

**Step 5: Commit**

```bash
git add src/lib/pencil/annotation-parser.ts src/lib/pencil/__tests__/annotation-parser.test.ts
git commit -m "feat(pencil): add annotation parser for [ComponentName] node name format"
```

---

### Task 3: Schema Builder

Convert parsed Pencil.dev annotations into our JSON schema format (`ReactInterfaceSchema`). This is the extraction bridge.

**Files:**
- Create: `src/lib/pencil/schema-builder.ts`
- Create: `src/lib/pencil/__tests__/schema-builder.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/pencil/__tests__/schema-builder.test.ts
import { describe, it, expect } from 'vitest'
import { buildSchemaFromAnnotations } from '../schema-builder'
import type { AnnotatedNode } from '../annotation-parser'

describe('buildSchemaFromAnnotations', () => {
  it('builds a schema with background as root', () => {
    const nodes: AnnotatedNode[] = [
      {
        id: '1', componentName: 'GalaxyBackground', label: 'Page',
        rawName: '[GalaxyBackground] Page', children: [
          { id: '2', componentName: 'HeroSection', label: 'Main Hero', rawName: '[HeroSection] Main Hero', children: [] },
          { id: '3', componentName: 'GlowCard', label: 'Feature 1', rawName: '[GlowCard] Feature 1', children: [] },
        ]
      },
    ]
    const schema = buildSchemaFromAnnotations(nodes)
    expect(schema.root.type).toBe('GalaxyBackground')
    expect(Array.isArray(schema.root.children)).toBe(true)
    const children = schema.root.children as Array<{ type: string }>
    expect(children[0].type).toBe('HeroSection')
    expect(children[1].type).toBe('GlowCard')
  })

  it('wraps multiple top-level nodes in a Container', () => {
    const nodes: AnnotatedNode[] = [
      { id: '1', componentName: 'HeroSection', label: 'Hero', rawName: '[HeroSection] Hero', children: [] },
      { id: '2', componentName: 'GlowCard', label: 'Card', rawName: '[GlowCard] Card', children: [] },
    ]
    const schema = buildSchemaFromAnnotations(nodes)
    expect(schema.root.type).toBe('Container')
    const children = schema.root.children as Array<{ type: string }>
    expect(children).toHaveLength(2)
  })

  it('returns valid schema structure', () => {
    const nodes: AnnotatedNode[] = [
      { id: '1', componentName: 'Navbar', label: 'Nav', rawName: '[Navbar] Nav', children: [] },
    ]
    const schema = buildSchemaFromAnnotations(nodes)
    expect(schema.version).toBe('1.0')
    expect(schema.root).toBeDefined()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/pencil/__tests__/schema-builder.test.ts
```
Expected: FAIL — module not found.

**Step 3: Implement**

```typescript
// src/lib/pencil/schema-builder.ts
import type { ReactInterfaceSchema, SchemaNode } from '@/types'
import type { AnnotatedNode } from './annotation-parser'
import { getComponentSpec } from './component-specs'

function annotatedNodeToSchemaNode(node: AnnotatedNode): SchemaNode {
  const children: SchemaNode[] = node.children.map(annotatedNodeToSchemaNode)
  return {
    type: node.componentName,
    props: {},
    children: children.length > 0 ? children : undefined,
  }
}

export function buildSchemaFromAnnotations(nodes: AnnotatedNode[]): ReactInterfaceSchema {
  if (nodes.length === 0) {
    return {
      version: '1.0',
      root: { type: 'Container', props: {}, children: [] },
    }
  }

  // If there's a single background component at root, use it as root
  if (nodes.length === 1) {
    return {
      version: '1.0',
      root: annotatedNodeToSchemaNode(nodes[0]),
    }
  }

  // Check if any top-level node is a background (use as root wrapper)
  const bgNode = nodes.find(n => getComponentSpec(n.componentName)?.isBackground)
  if (bgNode) {
    const otherNodes = nodes.filter(n => n !== bgNode)
    const bgSchema = annotatedNodeToSchemaNode(bgNode)
    const existingChildren = Array.isArray(bgSchema.children) ? bgSchema.children : []
    bgSchema.children = [
      ...existingChildren,
      ...otherNodes.map(annotatedNodeToSchemaNode),
    ]
    return { version: '1.0', root: bgSchema }
  }

  // Wrap all nodes in a Container
  return {
    version: '1.0',
    root: {
      type: 'Container',
      props: {},
      children: nodes.map(annotatedNodeToSchemaNode),
    },
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/pencil/__tests__/schema-builder.test.ts
```
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/lib/pencil/schema-builder.ts src/lib/pencil/__tests__/schema-builder.test.ts
git commit -m "feat(pencil): add schema builder to convert Pencil annotations to ReactInterfaceSchema"
```

---

### Task 4: Pencil UI Builder Skill

A Claude Code skill that, given a prompt, generates a beautiful Pencil.dev design file annotated with our component names. This is the primary skill users invoke.

**Files:**
- Create: `~/.claude/skills/pencil-ui-builder.md`

**Note:** No tests here — this is a Claude Code skill (markdown instructions). Validation is manual.

**Step 1: Create the skill**

```markdown
<!-- Save to: ~/.claude/skills/pencil-ui-builder.md -->
---
name: pencil-ui-builder
description: Generate a beautiful Pencil.dev design file from a prompt, annotated with production React component names from the ui-generator registry
trigger: when user asks to design a UI, create a design, or build something in Pencil
---

# Pencil UI Builder

Generate a beautiful Pencil.dev design from a prompt, with every node annotated with component names from the ui-generator registry.

## Component Annotation Convention

**Every node you create MUST be named:** `[ComponentName] Description`

Example: `[GalaxyBackground] Page Background`, `[HeroSection] Main Hero`, `[GlowCard] Feature 1`

The bracket prefix maps to production React components in `src/lib/registry/components.ts`.

## Steps

### 1. Parse the prompt
Identify: page type, tone (dark/light/colorful), key sections needed.

### 2. Select 6-12 components
Based on page type, choose from these categories:
- **Page bg** (pick 1): GalaxyBackground, HyperspeedBackground, IridescenceBackground, FloatingLinesBackground, LiquidEtherBackground
- **Nav** (pick 1): Navbar, DockNav, PillNav
- **Hero** (pick 1): HeroSection + optionally FuzzyText or SplitText for the title
- **Features** (2-4): GlowCard, SpotlightCard, MagicBento
- **Social proof** (optional): LogoLoop, MasonryGrid
- **Effects** (1-2): ElectricBorder, ShinyText, ScrollReveal, ShapeBlur, LaserFlow
- **Cursor** (optional): SplashCursor or TargetCursor

### 3. Get style guide
Call `get_style_guide` with tags matching the tone. For dark/tech: use tags ["dark", "futuristic", "minimal"]. For colorful: ["colorful", "playful", "bold"].

### 4. Open document
Call `open_document("new")` to create a fresh .pen file.

### 5. Generate design
Use `batch_design` to build the layout. Follow this structure:

```
page=I("root", { type: "frame", name: "[GalaxyBackground] Page Background", width: 1440, height: 3000, fill: "#050510" })
nav=I(page+"/children", { type: "frame", name: "[Navbar] Navigation", width: 1440, height: 72, ... })
hero=I(page+"/children", { type: "frame", name: "[HeroSection] Main Hero", width: 1440, height: 600, ... })
feat=I(page+"/children", { type: "frame", name: "[GlowCard] Feature 1", width: 320, height: 240, ... })
```

**Critical rules:**
- ALL node names MUST start with `[ComponentName]`
- Background components are always the root/outermost frame
- Navbar always at top
- Use realistic placeholder text (real headings, not "Lorem ipsum")
- Apply style guide colors and typography

### 6. Screenshot
Call `get_screenshot` on the root node and show it to the user.

### 7. Report
Tell the user:
- Which components were used (with registry names)
- How to extract code: "Say 'extract code' or use the pencil-extract-code skill"
```

**Step 2: Verify skill file exists**

```bash
cat ~/.claude/skills/pencil-ui-builder.md | head -20
```

**Step 3: Commit (in the project repo)**

```bash
cd /Users/shashanksaxena/Documents/Personal/Code/ui-generator
git add -A
git commit -m "docs: note pencil-ui-builder skill created at ~/.claude/skills/"
```

---

### Task 5: Pencil Extract Code Skill

A Claude Code skill that reads the current Pencil.dev design, finds component annotations, and produces production React code using our registry.

**Files:**
- Create: `~/.claude/skills/pencil-extract-code.md`

**Step 1: Create the skill**

```markdown
<!-- Save to: ~/.claude/skills/pencil-extract-code.md -->
---
name: pencil-extract-code
description: Extract production React component code from an annotated Pencil.dev design file
trigger: when user says "extract code", "get the code", "export to React", or "generate code from design"
---

# Pencil Extract Code

Read the current Pencil.dev design, find all [ComponentName] annotations, and produce production React code.

## Steps

### 1. Read the design
Call `get_editor_state` to get the active document.
Call `batch_get` on the root node to get all nodes.

### 2. Find annotated nodes
Look for all nodes whose name matches `[ComponentName] Label` pattern.
Build a tree: if a node has annotated children, they become children in the schema.

### 3. Build the component tree
Map each annotated node to a JSON schema node:
```json
{
  "type": "ComponentName",
  "props": {},
  "children": [...]
}
```

For background components (GalaxyBackground, HyperspeedBackground, etc.): make them the root.
For all others: nest inside the root or a Container wrapper.

### 4. Generate the React code
Using the component tree, generate a complete React component:

```tsx
import { GalaxyBackground } from '@/components/reactbits/galaxy-background'
import { HeroSection } from '@/components/ui/hero-section'
import { GlowCard } from '@/components/ui/glow-card'

export default function GeneratedPage() {
  return (
    <GalaxyBackground>
      <HeroSection
        title="Your Title"
        subtitle="Your subtitle text"
      />
      <div className="grid grid-cols-3 gap-6 px-8">
        <GlowCard title="Feature 1" description="Description here" />
      </div>
    </GalaxyBackground>
  )
}
```

### 5. Show install commands
List the npm packages needed for the components used.

### 6. Offer next steps
- "Copy this code to your project"
- "Refine the design in Pencil.dev and extract again"
- "Add more components: say 'add a [ComponentName] to the design'"
```

**Step 2: Verify skill file exists**

```bash
cat ~/.claude/skills/pencil-extract-code.md | head -20
```

**Step 3: Commit**

```bash
cd /Users/shashanksaxena/Documents/Personal/Code/ui-generator
git add docs/
git commit -m "docs: add pencil integration design plan"
```

---

### Task 6: Barrel Export + TypeScript Check

Wire up the new `src/lib/pencil/` modules for clean imports.

**Files:**
- Create: `src/lib/pencil/index.ts`

**Step 1: Create barrel**

```typescript
// src/lib/pencil/index.ts
export * from './component-specs'
export * from './annotation-parser'
export * from './schema-builder'
```

**Step 2: TypeScript check**

```bash
cd /Users/shashanksaxena/Documents/Personal/Code/ui-generator
npx tsc --noEmit
```
Expected: 0 errors.

**Step 3: Run all pencil tests**

```bash
npx vitest run src/lib/pencil/
```
Expected: All tests pass.

**Step 4: Build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add src/lib/pencil/index.ts
git commit -m "feat(pencil): export pencil integration modules"
```

---

### Task 7: End-to-End Manual Validation

Test the full workflow with a real prompt.

**Step 1: Open Claude Code in this project**

Make sure you're in `/Users/shashanksaxena/Documents/Personal/Code/ui-generator`.

**Step 2: Invoke the builder skill**

In Claude Code, type:
```
/pencil-ui-builder Build me a SaaS landing page for a project management tool called "TaskFlow" — dark theme, modern, futuristic
```

**Expected:**
- Claude gets Pencil.dev style guide
- Creates a new .pen file
- Generates design with annotated nodes (GalaxyBackground, Navbar, HeroSection, GlowCard etc.)
- Shows a screenshot
- Reports which components were used

**Step 3: Verify annotations in the design**

In Claude Code, run:
```
/pencil-extract-code
```

**Expected:**
- Claude reads the .pen file
- Finds annotated nodes
- Produces TypeScript React code with proper imports
- Lists install commands

**Step 4: Visual validation**

Open Pencil.dev desktop app and verify the design looks correct — proper layout, readable text, dark theme.

---

## Summary

| Task | Files | Status |
|------|-------|--------|
| 1. Component specs | `src/lib/pencil/component-specs.ts` | - |
| 2. Annotation parser | `src/lib/pencil/annotation-parser.ts` | - |
| 3. Schema builder | `src/lib/pencil/schema-builder.ts` | - |
| 4. Builder skill | `~/.claude/skills/pencil-ui-builder.md` | - |
| 5. Extract skill | `~/.claude/skills/pencil-extract-code.md` | - |
| 6. Barrel + checks | `src/lib/pencil/index.ts` | - |
| 7. E2E validation | Manual test | - |
