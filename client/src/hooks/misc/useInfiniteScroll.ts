import { useCallback, useRef } from 'react'
import _debounce from 'lodash/debounce'


export const useInfiniteScroll = <T extends Element>(
    callback: () => void,
    rootMargin = '0px',
    threshold = 1,
    debounceInterval = 500
): ((node: T | null) => void) => {
    const observer = useRef<IntersectionObserver | null>(null)
    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting || entry.intersectionRatio > 0) {
                    callback()
                }
            })
        },
        [callback]
    )
    const debouncedHandleIntersect = useCallback(
        _debounce(handleIntersect, debounceInterval),
        [handleIntersect, debounceInterval]
    )
    const cleanupObserver = useCallback(() => {
        if (observer.current) {
            observer.current.disconnect()
            observer.current = null
        }
    }, [])
    return useCallback(
        (node: T | null) => {
            cleanupObserver()
            if (node) {
                observer.current = new IntersectionObserver(
                    debouncedHandleIntersect,
                    {
                        rootMargin,
                        threshold,
                    }
                )
                observer.current.observe(node)
            }
        },
        [rootMargin, threshold, cleanupObserver, debouncedHandleIntersect]
    )
}