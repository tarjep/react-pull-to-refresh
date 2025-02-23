import { RefObject, useEffect, useState } from "react"

const MAX = 128
const height = 80
const k = 0.5
function appr(x: number) {
    return MAX * (1 - Math.exp((-k * x) / MAX))
}

export const usePullToRefresh = (
    ref: RefObject<HTMLDivElement | null>,
    triggerFn: () => Promise<string>,
) => {
    const [loading, setLoading] = useState(false)
    const [fraction, setFraction] = useState(0)

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
                    setFraction(dy / height)
                    if (dy > height) {
                        triggered = true
                    } else {
                        triggered = false
                    }
                }
            }

            const touchEnd = async () => {
                item.style.transition = "transform 0.35s cubic-bezier(.29,-0.01,.31,1.02)"

                if (triggered) {
                    setLoading(true)
                    item.style.transform = `translateY(${height}px)`
                    triggerFn()
                        .then(res => {
                            if (res === "Success") {
                                console.log("res", res)
                                item.style.transform = `translateY(0px)`
                                setLoading(false)
                                setFraction(0)
                            }
                        })
                        .catch(() => {
                            item.style.transform = `translateY(0px)`
                            setLoading(false)
                            setFraction(0)
                        })
                } else {
                    item.style.transform = `translateY(0px)`
                    setFraction(0)
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

    return { loading, fraction }
}
