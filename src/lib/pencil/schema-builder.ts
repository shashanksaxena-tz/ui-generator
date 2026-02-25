import type { ReactInterfaceSchema, SchemaNode } from '@/types'
import type { AnnotatedNode } from './annotation-parser'

// Components known to be full-page backgrounds
const BACKGROUND_COMPONENTS = new Set([
  'GalaxyBackground',
  'HyperspeedBackground',
  'IridescenceBackground',
  'FloatingLinesBackground',
  'LiquidEtherBackground',
  'RippleGridBackground',
  'GradientBlindsBackground',
  'GridDistortionBackground',
  'FaultyTerminalBackground',
  'PixelBlastBackground',
  'ColorBendsBackground',
])

function isBackground(componentName: string): boolean {
  return BACKGROUND_COMPONENTS.has(componentName)
}

function toSchemaNode(node: AnnotatedNode): SchemaNode {
  const children: SchemaNode[] = node.children.map(toSchemaNode)
  return {
    type: node.componentName,
    props: {},
    ...(children.length > 0 ? { children } : {}),
  }
}

export function buildSchemaFromAnnotations(nodes: AnnotatedNode[]): ReactInterfaceSchema {
  if (nodes.length === 0) {
    return {
      version: '1.0',
      root: { type: 'Container', props: {}, children: [] },
    }
  }

  if (nodes.length === 1) {
    return {
      version: '1.0',
      root: toSchemaNode(nodes[0]),
    }
  }

  // Find a background node to use as root
  const bgIndex = nodes.findIndex(n => isBackground(n.componentName))
  if (bgIndex !== -1) {
    const bgNode = nodes[bgIndex]
    const otherNodes = nodes.filter((_, i) => i !== bgIndex)
    const bgSchema = toSchemaNode(bgNode)
    const existingChildren = Array.isArray(bgSchema.children) ? bgSchema.children : []
    bgSchema.children = [
      ...existingChildren,
      ...otherNodes.map(toSchemaNode),
    ]
    return { version: '1.0', root: bgSchema }
  }

  // No background — wrap all in Container
  return {
    version: '1.0',
    root: {
      type: 'Container',
      props: {},
      children: nodes.map(toSchemaNode),
    },
  }
}
