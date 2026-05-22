import { useEffect, useRef, useState } from "react";

export default function useIntersectionList({
    count,
    options,
}: {
    count: number;
    options?: IntersectionObserverInit;
}) {
    const refs = useRef<(HTMLElement | null)[]>([]);
    const [visibleMap, setVisibleMap] = useState<boolean[]>([]);

    useEffect(() => {
        if (count === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = refs.current.indexOf(entry.target as HTMLElement);
                if (index === -1) return;
                setVisibleMap((prev) => {
                    const next = [...prev];
                    next[index] = entry.isIntersecting;
                    return next;
                });
            });
        }, options);

        refs.current.forEach((el) => { if (el) observer.observe(el); });

        return () => observer.disconnect();
    }, [count]);

    return [refs, visibleMap] as const;
}