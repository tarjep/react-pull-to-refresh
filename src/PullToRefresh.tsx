import { ReactNode, useRef } from "react"
import { usePullToRefresh } from "./usePullToRefresh"

export const PullToRefresh = ({
    triggerFn,
    children,
}: {
    triggerFn: () => Promise<string>
    children: ReactNode
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const { loading, fraction } = usePullToRefresh(ref, triggerFn)

    return (
        <div
            style={{
                position: "relative",
            }}
        >
            {fraction > 0 && !loading && (
                <div
                    style={{
                        position: "absolute",
                        top: 30 * fraction * 1,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        transform: `scale(${fraction})`,
                        opacity: fraction,
                    }}
                >
                    Opening
                </div>
            )}
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: 30,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        transform: `scale(${fraction})`,
                    }}
                >
                    Loading
                </div>
            )}
            <div
                ref={ref}
                style={{
                    position: "relative",
                    height: "100dvh",
                    overflow: "scroll",
                    padding: "1.5rem",
                    userSelect: "none",
                }}
            >
                {children}
            </div>
        </div>
    )
}
