import { useEffect, useRef, useState } from "react";

export default function useIntersection({
    options,
    delay = 0,
}: {
    options?: IntersectionObserverInit;
    delay?: number;
}) {
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
    const elementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setTimeout(() => {
                    setIsIntersecting(entry.isIntersecting); // Actualiza el estado a true si está intersectando
                }, delay);
            });
        }, options);

        observer.observe(element);

        return () => observer.unobserve(element);
    }, []); // Asegúrate de incluir las dependencias

    return [elementRef, isIntersecting] as const; // Retorna como un arreglo
}
