import { ReactNode, useRef } from "react"
import { usePullToRefresh } from "./usePullToRefresh"

export const PullToRefresh = ({
    onRefresh,
    LoadingIcon,
    children,
}: {
    onRefresh: () => Promise<string>
    LoadingIcon: () => ReactNode
    children: ReactNode
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const { loading, fraction } = usePullToRefresh(ref, onRefresh)

    return (
        <div
            style={{
                position: "relative",
            }}
        >
            {((fraction > 0 && !loading) || loading) && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        top: loading ? 30 : 30 * fraction * 1,
                        transform: loading ? "scale(1)" : `scale(${Math.min(fraction, 1)})`,
                        opacity: loading ? 1 : fraction,
                        animation: loading ? "spinnerAnim 1s linear infinite" : "",
                    }}
                >
                    <LoadingIcon />
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
