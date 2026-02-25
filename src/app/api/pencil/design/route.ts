import { NextRequest, NextResponse } from 'next/server'
import { selectRelevantComponents } from '@/lib/generation/component-selection'
import { COMPONENT_SPECS, getBackgroundComponents } from '@/lib/pencil/component-specs'

export interface PencilDesignRequest {
  prompt: string
  pageType?: string
  tone?: 'dark' | 'light' | 'colorful' | 'corporate'
}

export interface PencilDesignResponse {
  selectedComponents: string[]
  backgroundComponent: string
  styleGuideTags: string[]
  designInstructions: string  // Human-readable instructions for the skill
  annotationMap: Record<string, string>  // componentName -> suggested node label
}

function selectStyleGuideTags(tone?: string): string[] {
  if (tone === 'light') return ['clean', 'minimal', 'white-space', 'elegant']
  if (tone === 'colorful') return ['colorful', 'bold', 'creative', 'playful']
  if (tone === 'corporate') return ['professional', 'clean', 'corporate', 'enterprise']
  // Default: dark/futuristic
  return ['dark', 'futuristic', 'minimal', 'tech']
}

function buildAnnotationMap(components: string[]): Record<string, string> {
  const counts: Record<string, number> = {}
  const result: Record<string, string> = {}

  for (const comp of components) {
    counts[comp] = (counts[comp] ?? 0) + 1
    const count = counts[comp]
    const suffix = count > 1 ? ` ${count}` : ''
    const label = comp
      .replace(/([A-Z])/g, ' $1')
      .trim()
    result[`${comp}_${count}`] = `[${comp}] ${label}${suffix}`
  }

  return result
}

function buildDesignInstructions(components: string[], prompt: string): string {
  const lines = [
    `Design prompt: "${prompt}"`,
    '',
    'Components to place (in order, top to bottom):',
  ]

  for (const comp of components) {
    const spec = COMPONENT_SPECS[comp]
    if (spec) {
      lines.push(`  • [${comp}]: ${spec.visualDescription}`)
      lines.push(`    Size: ${spec.suggestedWidth}×${spec.suggestedHeight}px`)
      lines.push(`    Notes: ${spec.pencilNotes}`)
    } else {
      lines.push(`  • [${comp}]: Component from ui-generator registry`)
    }
  }

  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const body: PencilDesignRequest = await req.json()

    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }

    // Use the existing component selection logic
    let selectedComponents: string[] = []
    try {
      const selectionResult = await selectRelevantComponents(body.prompt)
      selectedComponents = selectionResult.components
    } catch {
      // Fallback to common components if selection fails
      selectedComponents = [
        'GalaxyBackground', 'Navbar', 'HeroSection',
        'GlowCard', 'GlowCard', 'GlowCard', 'LogoLoop',
      ]
    }

    // Ensure we have a background component
    const backgrounds = getBackgroundComponents()
    const hasBackground = selectedComponents.some(c => backgrounds.includes(c))
    if (!hasBackground) {
      selectedComponents.unshift('GalaxyBackground')
    }

    const styleGuideTags = selectStyleGuideTags(body.tone)
    const annotationMap = buildAnnotationMap(selectedComponents)
    const designInstructions = buildDesignInstructions(selectedComponents, body.prompt)

    const backgroundComponent = selectedComponents.find(c => backgrounds.includes(c)) ?? 'GalaxyBackground'

    const response: PencilDesignResponse = {
      selectedComponents,
      backgroundComponent,
      styleGuideTags,
      designInstructions,
      annotationMap,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[pencil/design] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate design instructions' },
      { status: 500 }
    )
  }
}
