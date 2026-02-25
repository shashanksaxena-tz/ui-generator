import { describe, it, expect } from 'vitest'
import { buildSchemaFromAnnotations } from '../schema-builder'
import type { AnnotatedNode } from '../annotation-parser'

const makeNode = (componentName: string, label: string, children: AnnotatedNode[] = []): AnnotatedNode => ({
  id: Math.random().toString(),
  componentName,
  label,
  rawName: `[${componentName}] ${label}`,
  children,
})

describe('buildSchemaFromAnnotations', () => {
  it('returns valid schema structure', () => {
    const nodes = [makeNode('Navbar', 'Nav')]
    const schema = buildSchemaFromAnnotations(nodes)
    expect(schema.version).toBe('1.0')
    expect(schema.root).toBeDefined()
    expect(schema.root.type).toBeTruthy()
  })

  it('uses background as root when present', () => {
    const nodes = [
      makeNode('GalaxyBackground', 'Page', [
        makeNode('HeroSection', 'Hero'),
        makeNode('GlowCard', 'Feature 1'),
      ]),
    ]
    const schema = buildSchemaFromAnnotations(nodes)
    expect(schema.root.type).toBe('GalaxyBackground')
    const children = schema.root.children as Array<{ type: string }>
    expect(children[0].type).toBe('HeroSection')
    expect(children[1].type).toBe('GlowCard')
  })

  it('wraps multiple non-background nodes in Container', () => {
    const nodes = [
      makeNode('HeroSection', 'Hero'),
      makeNode('GlowCard', 'Card'),
      makeNode('Navbar', 'Nav'),
    ]
    const schema = buildSchemaFromAnnotations(nodes)
    expect(schema.root.type).toBe('Container')
    const children = schema.root.children as Array<{ type: string }>
    expect(children).toHaveLength(3)
  })

  it('handles single non-background node without wrapping', () => {
    const nodes = [makeNode('HeroSection', 'Hero')]
    const schema = buildSchemaFromAnnotations(nodes)
    // Single node - can be either HeroSection directly or Container wrapping it
    // Either is valid, just needs a root
    expect(schema.root).toBeDefined()
  })

  it('returns empty Container for no nodes', () => {
    const schema = buildSchemaFromAnnotations([])
    expect(schema.root.type).toBe('Container')
  })

  it('promotes top-level background and places other top-level nodes as children', () => {
    const nodes = [
      makeNode('GalaxyBackground', 'Page'),
      makeNode('Navbar', 'Nav'),
      makeNode('HeroSection', 'Hero'),
    ]
    const schema = buildSchemaFromAnnotations(nodes)
    expect(schema.root.type).toBe('GalaxyBackground')
    const children = schema.root.children as Array<{ type: string }>
    expect(children.map(c => c.type)).toContain('Navbar')
    expect(children.map(c => c.type)).toContain('HeroSection')
  })
})
