import {
    useCallback,
    useEffect,
    useRef,
    type MouseEvent as ReactMouseEvent,
    type RefObject,
} from "react";

interface UseTiltOptions<T extends HTMLElement> {
    /** Ref del elemento que se inclina en 3D. */
    ref: RefObject<T | null>;
    /** Máximo de grados de inclinación en cada eje. */
    max?: number;
    /** Valor de perspectiva en px que simula la profundidad. */
    perspective?: number;
    /** Escala al hacer hover. 1 = sin escala. */
    scale?: number;
    /** Desactiva el efecto (p.ej. pantallas táctiles). */
    disabled?: boolean;
}

/**
 * Inclinación 3D que sigue al ratón, optimizada:
 * - Sin re-renders de React durante el movimiento (solo se escribe el DOM del card afectado).
 * - Throttling con requestAnimationFrame: una sola escritura de estilo por frame.
 * - `will-change: transform` solo mientras dura el hover, y se libera al salir.
 * - Respeta prefers-reduced-motion.
 */
export default function useTilt<T extends HTMLElement>({
    ref,
    max = 18,
    perspective = 1000,
    scale = 1.02,
    disabled = false,
}: UseTiltOptions<T>) {
    const rafRef = useRef<number | null>(null);
    const leaveTimerRef = useRef<number | null>(null);
    const cursorRef = useRef<{ px: number; py: number } | null>(null);
    const reducedMotionRef = useRef(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        reducedMotionRef.current = mq.matches;
        const onChange = (e: MediaQueryListEvent) => {
            reducedMotionRef.current = e.matches;
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        return () => {
            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
            }
            if (leaveTimerRef.current !== null) {
                window.clearTimeout(leaveTimerRef.current);
            }
        };
    }, []);

    const writeFrame = useCallback(() => {
        rafRef.current = null;
        const el = ref.current;
        const cursor = cursorRef.current;
        if (!el || !cursor) return;

        const { px, py } = cursor;
        const rotateX = (0.5 - py) * 2 * max;
        const rotateY = (px - 0.5) * 2 * max;

        el.style.transform =
            `perspective(${perspective}px) ` +
            `rotateX(${rotateX.toFixed(2)}deg) ` +
            `rotateY(${rotateY.toFixed(2)}deg) ` +
            `scale3d(${scale}, ${scale}, 1) ` +
            `translate3d(0, 0, 0)`;

        // Brillo holográfico que acompaña al puntero
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
        el.style.setProperty("--sx", `${px * 100}%`);
        el.style.setProperty("--sy", `${py * 100}%`);
    }, [ref, max, perspective, scale]);

    const scheduleFrame = useCallback(() => {
        if (rafRef.current !== null) return;
        rafRef.current = window.requestAnimationFrame(writeFrame);
    }, [writeFrame]);

    const onMouseEnter = useCallback(() => {
        if (disabled || reducedMotionRef.current) return;
        const el = ref.current;
        if (!el) return;

        if (rafRef.current !== null) {
            window.cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (leaveTimerRef.current !== null) {
            window.clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
        }

        // Promueve a capa GPU solo mientras el puntero está encima
        el.style.willChange = "transform";
    }, [disabled, ref]);

    const onMouseMove = useCallback(
        (e: ReactMouseEvent<T>) => {
            if (disabled || reducedMotionRef.current) return;
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            cursorRef.current = {
                px: (e.clientX - rect.left) / rect.width,
                py: (e.clientY - rect.top) / rect.height,
            };
            scheduleFrame();
        },
        [disabled, ref, scheduleFrame]
    );

    const onMouseLeave = useCallback(() => {
        if (disabled || reducedMotionRef.current) return;
        const el = ref.current;
        if (!el) return;

        cursorRef.current = null;
        if (rafRef.current !== null) {
            window.cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (leaveTimerRef.current !== null) {
            window.clearTimeout(leaveTimerRef.current);
        }

        // Retorna a la posición original (la transición CSS de transform suaviza)
        el.style.removeProperty("transform");
        el.style.removeProperty("--gx");
        el.style.removeProperty("--gy");
        el.style.removeProperty("--sx");
        el.style.removeProperty("--sy");

        leaveTimerRef.current = window.setTimeout(() => {
            el.style.willChange = "auto";
            leaveTimerRef.current = null;
        }, 500);
    }, [disabled, ref]);

    return { onMouseEnter, onMouseMove, onMouseLeave };
}