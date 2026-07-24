import { useEffect, useRef } from "react"

// Events that count as "the user is still here". Registered as passive so they
// never block scrolling/typing — the handler only resets a timer.
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
] as const

/**
 * Logs the admin out after `timeoutMs` of no interaction (idle / inactivity guard).
 *
 * NOTE: this is an *idle* timeout — the countdown restarts on every interaction, so
 * an actively-working user is never kicked mid-task. It only fires when the session
 * is left untouched (e.g. a screen left open overnight). Paired with the token now
 * living in sessionStorage, this closes the "stayed logged in all night" gap.
 *
 * `onIdle` is expected to perform the actual logout (clear token + redirect).
 */
export function useIdleLogout(timeoutMs: number, onIdle: () => void) {
  // Keep the latest onIdle without re-subscribing the listeners on every render.
  const onIdleRef = useRef(onIdle)
  useEffect(() => {
    onIdleRef.current = onIdle
  }, [onIdle])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    // Guard so a late activity event after the timeout can't fire logout twice.
    let fired = false

    const reset = () => {
      if (fired) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        fired = true
        onIdleRef.current()
      }, timeoutMs)
    }

    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, reset, { passive: true }),
    )
    reset() // arm the timer on mount

    return () => {
      clearTimeout(timer)
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, reset))
    }
  }, [timeoutMs])
}
