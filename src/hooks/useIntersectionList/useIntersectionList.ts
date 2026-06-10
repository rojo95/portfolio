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

        setVisibleMap(new Array(count).fill(false));

        const observer = new IntersectionObserver((entries) => {
            setVisibleMap((prev) => {
                const next = [...prev];
                let changed = false;
                for (const entry of entries) {
                    const index = refs.current.indexOf(
                        entry.target as HTMLElement
                    );
                    if (index === -1) continue;
                    if (next[index] !== entry.isIntersecting) {
                        next[index] = entry.isIntersecting;
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });
        }, options);

        const currentRefs = [...refs.current];
        for (const el of currentRefs) {
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [count]);

    return [refs, visibleMap] as const;
}
