import { describe, it, expect } from 'vitest'
import { getComponentSpec, COMPONENT_SPECS, getBackgroundComponents, getFullWidthComponents } from '../component-specs'

describe('getComponentSpec', () => {
  it('returns spec for known component', () => {
    const spec = getComponentSpec('GlowCard')
    expect(spec).toBeDefined()
    expect(spec!.pencilType).toBe('frame')
    expect(spec!.visualDescription).toBeTruthy()
    expect(spec!.suggestedWidth).toBeGreaterThan(0)
    expect(spec!.suggestedHeight).toBeGreaterThan(0)
    expect(spec!.pencilNotes).toBeTruthy()
  })

  it('returns undefined for unknown component', () => {
    expect(getComponentSpec('NonExistent')).toBeUndefined()
  })

  it('covers at least 25 components', () => {
    expect(Object.keys(COMPONENT_SPECS).length).toBeGreaterThanOrEqual(25)
  })

  it('all background components have isBackground=true and isFullWidth=true', () => {
    const backgrounds = getBackgroundComponents()
    expect(backgrounds.length).toBeGreaterThan(0)
    backgrounds.forEach(name => {
      const spec = COMPONENT_SPECS[name]
      expect(spec.isBackground, `${name} should be background`).toBe(true)
      expect(spec.isFullWidth, `${name} should be full width`).toBe(true)
    })
  })

  it('all background components have suggestedWidth=1440', () => {
    getBackgroundComponents().forEach(name => {
      expect(COMPONENT_SPECS[name].suggestedWidth).toBe(1440)
    })
  })

  it('getFullWidthComponents returns components with isFullWidth=true', () => {
    const fullWidth = getFullWidthComponents()
    expect(fullWidth.length).toBeGreaterThan(0)
    fullWidth.forEach(name => {
      expect(COMPONENT_SPECS[name].isFullWidth).toBe(true)
    })
  })
})
