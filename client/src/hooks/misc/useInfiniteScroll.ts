import { useCallback, useRef, RefCallback } from 'react'


export const useInfiniteScroll = <T extends Element>(callback: () => void): RefCallback<T> => {
    const observer = useRef<IntersectionObserver | undefined>()
    return useCallback(
        (node: T) => {
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    callback()
                }
            })
            if (node) observer.current.observe(node)
        },
        [callback]
    )
}