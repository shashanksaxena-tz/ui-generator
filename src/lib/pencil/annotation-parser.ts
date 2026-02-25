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

function buildAnnotatedNode(node: RawNode, parsed: ParsedAnnotation): AnnotatedNode {
  const annotatedChildren: AnnotatedNode[] = []
  for (const child of node.children ?? []) {
    const childParsed = parseAnnotation(child.name)
    if (childParsed) {
      annotatedChildren.push(buildAnnotatedNode(child, childParsed))
    }
  }
  return {
    id: node.id,
    componentName: parsed.componentName,
    label: parsed.label,
    rawName: node.name,
    children: annotatedChildren,
  }
}

export function parseNodeTree(nodes: RawNode[]): AnnotatedNode[] {
  const result: AnnotatedNode[] = []
  for (const node of nodes) {
    const parsed = parseAnnotation(node.name)
    if (parsed) {
      result.push(buildAnnotatedNode(node, parsed))
    } else {
      // Recurse into unannotated nodes to find annotated children
      const childResults = parseNodeTree(node.children ?? [])
      result.push(...childResults)
    }
  }
  return result
}
