import { RefObject, useEffect } from "react"

const MAX = 128
const height = 80
const k = 0.5
function appr(x: number) {
    return MAX * (1 - Math.exp((-k * x) / MAX))
}

export const usePullToRefresh = (ref: RefObject<HTMLDivElement | null>, triggerFn: () => void) => {
    useEffect(() => {
        if (!ref.current) return
        const item = ref.current

        const touchStart = (startEvent: TouchEvent) => {
            if (!ref.current) return

            item.style.transition = ""
            let initialY = startEvent.touches[0].clientY
            let triggered = false

            const touchMove = (moveEvent: TouchEvent) => {
                if (!ref.current) return

                const scrollTop = ref.current.scrollTop

                if (scrollTop > 0) {
                    initialY = moveEvent.touches[0].clientY
                } else {
                    const currentY = moveEvent.touches[0].clientY
                    const dy = appr(currentY - initialY)

                    if (dy <= 0) return

                    item.style.transform = `translateY(${dy}px)`

                    if (dy > height) {
                        triggered = true
                    } else {
                        triggered = false
                    }
                }
            }

            const touchEnd = async () => {
                item.style.transition = "transform 0.25s cubic-bezier(.5,0,.5,1.01)"

                if (triggered) {
                    item.style.transform = `translateY(${height}px)`
                    triggerFn()

                    setTimeout(() => {
                        item.style.transform = `translateY(0px)`
                    }, 2000)
                } else {
                    item.style.transform = `translateY(0px)`
                }

                item.addEventListener("transitionend", onTransitionEnd)
                item.removeEventListener("touchmove", touchMove)
                item.removeEventListener("touchend", touchEnd)
            }

            const onTransitionEnd = () => {
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
