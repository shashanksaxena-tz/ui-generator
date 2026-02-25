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

  it('does not match lowercase or invalid bracket content', () => {
    expect(parseAnnotation('[not-valid] Label')).toBeNull()
    expect(parseAnnotation('[123Start] Label')).toBeNull()
  })
})

describe('isAnnotated', () => {
  it('returns true for annotated node names', () => {
    expect(isAnnotated('[GlowCard] Feature')).toBe(true)
    expect(isAnnotated('[GalaxyBackground]')).toBe(true)
    expect(isAnnotated('[HeroSection] Main Hero')).toBe(true)
  })
  it('returns false for plain names', () => {
    expect(isAnnotated('Frame 1')).toBe(false)
    expect(isAnnotated('')).toBe(false)
    expect(isAnnotated('Just text')).toBe(false)
  })
})

describe('parseNodeTree', () => {
  it('extracts all annotated nodes from a flat list', () => {
    const nodes = [
      { id: '1', name: '[GalaxyBackground] Page', children: [] },
      { id: '2', name: 'Some unannotated frame', children: [] },
      { id: '3', name: '[HeroSection] Main Hero', children: [] },
      { id: '4', name: '[GlowCard] Feature 1', children: [] },
      { id: '5', name: '[GlowCard] Feature 2', children: [] },
    ]
    const result = parseNodeTree(nodes)
    expect(result).toHaveLength(4)
    expect(result[0].componentName).toBe('GalaxyBackground')
    expect(result[1].componentName).toBe('HeroSection')
    expect(result[2].componentName).toBe('GlowCard')
    expect(result[2].label).toBe('Feature 1')
    expect(result[3].label).toBe('Feature 2')
  })

  it('handles nested annotated children', () => {
    const nodes = [
      {
        id: '1',
        name: '[GalaxyBackground] Page',
        children: [
          { id: '2', name: '[HeroSection] Hero', children: [] },
          { id: '3', name: '[GlowCard] Card', children: [] },
        ]
      },
    ]
    const result = parseNodeTree(nodes)
    // Root node
    expect(result[0].componentName).toBe('GalaxyBackground')
    expect(result[0].children).toHaveLength(2)
    expect(result[0].children[0].componentName).toBe('HeroSection')
    expect(result[0].children[1].componentName).toBe('GlowCard')
  })

  it('returns empty array for empty input', () => {
    expect(parseNodeTree([])).toEqual([])
  })
})
