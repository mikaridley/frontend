import { useEffect } from 'react'

// small helper hook for task popups:
//  -popup is already roughly positioned (usually under the clicked button)
//  -we check if the popup bottom goes past the viewport
//  -if it does – we move it up just enough so the whole thing stays visible
//


//used mostly in label popup
export function popupToViewportHook(popupRef, position, extraDeps = []) {
  useEffect(() => {
    if (!position || !popupRef?.current) return

    const el = popupRef.current
    let timeoutId = null
    let resizeObserver = null
    let lastHeight = 0
    let stableCount = 0
    
    const adjustPosition = () => {
      if (!popupRef?.current) return
      
      const rect = el.getBoundingClientRect() // get the position of the popup and its height
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      const margin = 30
      const overflow = rect.bottom + margin - viewportHeight

      let finalTop = rect.top

      if (overflow > 0) {
        finalTop = Math.max(0, rect.top - overflow) // prevent going above viewport
        el.style.top = `${finalTop}px` // move the popup up so its bottom is visible
      }
      
      const availableSpace = viewportHeight - finalTop
      el.style.maxHeight = `${availableSpace}px`
      
      // check if height has stabilized
      const currentHeight = rect.height
      if (Math.abs(currentHeight - lastHeight) < 1) {
        stableCount++
      } else {
        stableCount = 0
      }
      lastHeight = currentHeight
    }

    const runAdjustment = () => {
      adjustPosition()
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          adjustPosition()
          
          timeoutId = setTimeout(() => {
            adjustPosition()
          }, 50)
        })
      })
    }

    runAdjustment()

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          adjustPosition()
        }, 10)
      })
      resizeObserver.observe(el)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [popupRef, position, ...extraDeps]) // run the effect when the popupRef, position or extraDeps change
}



