import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  resetMotionForTests,
  resolveMotion,
  setMotionSetting,
  useMotionPreference,
} from './motion'

let systemReduced = false
const changeListeners = new Set<() => void>()

beforeEach(() => {
  systemReduced = false
  changeListeners.clear()
  resetMotionForTests()
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('reduce') && systemReduced
    },
    media: query,
    addEventListener: (_: string, listener: () => void) =>
      changeListeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      changeListeners.delete(listener),
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete document.documentElement.dataset.motion
})

describe('resolveMotion', () => {
  it('lets an explicit setting win over the system preference', () => {
    expect(resolveMotion('reduce', false)).toBe('reduce')
    expect(resolveMotion('full', true)).toBe('full')
    expect(resolveMotion('system', true)).toBe('reduce')
    expect(resolveMotion('system', false)).toBe('full')
  })
})

describe('useMotionPreference', () => {
  it('follows the system preference by default, including live changes', () => {
    const { result } = renderHook(() => useMotionPreference())
    expect(result.current).toMatchObject({ setting: 'system', reduced: false })

    act(() => {
      systemReduced = true
      for (const listener of changeListeners) listener()
    })
    expect(result.current.reduced).toBe(true)
    expect(document.documentElement.dataset.motion).toBe('reduce')
  })

  it('persists an explicit setting and reflects it on <html>', () => {
    systemReduced = true
    const { result } = renderHook(() => useMotionPreference())
    act(() => setMotionSetting('full'))
    expect(result.current).toMatchObject({ setting: 'full', reduced: false })
    expect(localStorage.getItem('motion')).toBe('full')
    expect(document.documentElement.dataset.motion).toBe('full')

    act(() => setMotionSetting('system'))
    expect(result.current).toMatchObject({ setting: 'system', reduced: true })
    expect(localStorage.getItem('motion')).toBeNull()
  })
})
