import { useEffect } from 'react'

// small helper hook for task popups:
//  -popup is already roughly positioned (usually under the clicked button)
//  -we check if the popup bottom goes past the viewport
//  -if it does – we move it up just enough so the whole thing stays visible
//
// extraDeps for the dependencies
export function popupToViewportHook(popupRef, position, extraDeps = []) {
  useEffect(() => {
    if (!position || !popupRef?.current) return

    const el = popupRef.current
    const rect = el.getBoundingClientRect() // get the position of the popup and its height
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight

    const margin = 16
    const overflow = rect.bottom + margin - viewportHeight

    if (overflow > 0) {
      const newTop = Math.max(margin, rect.top - overflow)
      el.style.top = `${newTop}px` // move the popup up so its bottom is visible
    }
  }, [popupRef, position, ...extraDeps]) // run the effect when the popupRef, position or extraDeps change
}



