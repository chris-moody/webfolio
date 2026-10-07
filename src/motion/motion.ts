import { useSyncExternalStore } from 'react'

/**
 * Motion preference: the visitor's site setting combined with the OS-level
 * `prefers-reduced-motion`. The effective value lives on <html> as
 * `data-motion="reduce" | "full"`, so CSS (including Tailwind's motion-safe /
 * motion-reduce variants, redefined in tokens.css) and scripts agree.
 */
export type MotionSetting = 'system' | 'reduce' | 'full'
export type Motion = 'reduce' | 'full'

export const MOTION_STORAGE_KEY = 'motion'
const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Runs inline in <head> before first paint (root.tsx), so a visitor who
 * reduced motion never sees an animation start. Keep it dependency-free.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{var s=localStorage.getItem('${MOTION_STORAGE_KEY}');var r=s==='reduce'||(s!=='full'&&matchMedia('${QUERY}').matches);document.documentElement.dataset.motion=r?'reduce':'full'}catch(e){document.documentElement.dataset.motion='full'}})()`

export const resolveMotion = (
  setting: MotionSetting,
  systemReduced: boolean
): Motion =>
  setting === 'reduce' || (setting === 'system' && systemReduced)
    ? 'reduce'
    : 'full'

const readSetting = (): MotionSetting => {
  try {
    const value = localStorage.getItem(MOTION_STORAGE_KEY)
    return value === 'reduce' || value === 'full' ? value : 'system'
  } catch {
    return 'system'
  }
}

interface Snapshot {
  setting: MotionSetting
  motion: Motion
}

const SERVER_SNAPSHOT: Snapshot = { setting: 'system', motion: 'full' }
const listeners = new Set<() => void>()
let snapshot: Snapshot | null = null
let mediaQuery: MediaQueryList | null = null
let listening = false

const compute = (): Snapshot => {
  const setting = readSetting()
  const motion = resolveMotion(setting, mediaQuery?.matches ?? false)
  return { setting, motion }
}

const refresh = () => {
  const next = compute()
  if (
    snapshot &&
    next.setting === snapshot.setting &&
    next.motion === snapshot.motion
  )
    return
  snapshot = next
  document.documentElement.dataset.motion = next.motion
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  if (!listening && typeof window !== 'undefined') {
    listening = true
    mediaQuery ??= window.matchMedia(QUERY)
    mediaQuery.addEventListener('change', refresh)
    // Another tab changed the setting.
    window.addEventListener('storage', (event) => {
      if (event.key === MOTION_STORAGE_KEY) refresh()
    })
  }
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => {
  if (!snapshot) {
    if (!mediaQuery && typeof window !== 'undefined')
      mediaQuery = window.matchMedia(QUERY)
    snapshot = compute()
  }
  return snapshot
}

export const setMotionSetting = (setting: MotionSetting) => {
  try {
    if (setting === 'system') localStorage.removeItem(MOTION_STORAGE_KEY)
    else localStorage.setItem(MOTION_STORAGE_KEY, setting)
  } catch {
    // Without storage the choice lasts for this page view only.
  }
  snapshot = null
  refresh()
}

/** The visitor's setting and the effective motion level. */
export const useMotionPreference = () => {
  const { setting, motion } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => SERVER_SNAPSHOT
  )
  return {
    setting,
    motion,
    reduced: motion === 'reduce',
    setSetting: setMotionSetting,
  }
}

/** True when animation should be replaced with a static alternative. */
export const useReducedMotion = () => useMotionPreference().reduced

/** For non-React code (GSAP helpers): reads the effective value from <html>. */
export const isReducedMotion = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.motion === 'reduce'

/** Test hook: forget cached state between tests. */
export const resetMotionForTests = () => {
  snapshot = null
  mediaQuery = null
  listening = false
  listeners.clear()
}
