import { RefObject, useEffect } from "react"

const MAX = 128
const k = 0.4
function appr(x: number) {
    return MAX * (1 - Math.exp((-k * x) / MAX))
}

export const usePullToRefresh = (ref: RefObject<HTMLDivElement | null>, triggerFn: () => void) => {
    useEffect(() => {
        if (!ref.current) return
        const item = ref.current

        const touchStart = (startEvent: TouchEvent) => {
            if (!ref.current) return

            const initialY = startEvent.touches[0].clientY
            let triggered = false

            const touchMove = (moveEvent: TouchEvent) => {
                if (!ref.current) return

                const scrollTop = ref.current.scrollTop
                if (scrollTop > 0) return

                const currentY = moveEvent.touches[0].clientY
                const dy = appr(currentY - initialY)

                item.style.transform = `translateY(${dy}px)`

                if (dy > 50) {
                    triggered = true
                } else {
                    triggered = false
                }
            }

            const touchEnd = async () => {
                item.style.transition = "transform 0.2s"
                if (triggered) {
                    triggerFn()
                    setTimeout(() => {
                        item.style.transform = `translateY(0px)`
                    }, 1000)
                } else {
                    item.style.transform = `translateY(0px)`
                }
                // listen for transition end event
                item.addEventListener("transitionend", onTransitionEnd)
                item.removeEventListener("touchmove", touchMove)
                item.removeEventListener("touchend", touchEnd)
            }

            const onTransitionEnd = () => {
                item.style.transition = ""
                item.removeEventListener("transitionend", onTransitionEnd)
            }

            item.addEventListener("touchmove", touchMove, { passive: true })
            item.addEventListener("touchend", touchEnd, { passive: true })
        }
        item.addEventListener("touchstart", touchStart, { passive: true })

        return () => {
            item.removeEventListener("touchstart", touchStart)
        }
    }, [ref, triggerFn])
}
