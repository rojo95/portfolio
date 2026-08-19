import { useEffect, useMemo, useState } from "react";
import "./Snowfall.css";

/** ¿Estamos en temporada de nieve? (1 de diciembre → 7 de enero, cruzando año) */
function isSnowSeason(now: Date = new Date()): boolean {
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Diciembre (inclusive todo el mes)
    if (month === 12) return true;
    // Enero: solo hasta el día 7 inclusive
    if (month === 1) return day <= 7;
    return false;
}

/**
 * Nieve decorativa ligera.
 * - Solo se muestra entre el 1 de diciembre y el 7 de enero.
 * - 100% animación CSS (transform/translate3d) → corre en GPU, sin reflows.
 * - La cantidad de copos se adapta al ancho de pantalla para no saturar.
 * - No interfiere con clics (pointer-events: none).
 * - Respeta prefers-reduced-motion.
 */
export default function Snowfall() {
    // Fuera de temporada: no renderiza nada (evita trabajo innecesario)
    const [inSeason] = useState<boolean>(() => isSnowSeason());

    // Cantidad de copos según el tamaño de pantalla (ligero por diseño)
    const [count, setCount] = useState<number>(40);

    useEffect(() => {
        const compute = () => {
            const width = window.innerWidth;
            if (width < 640) setCount(25);
            else if (width < 1024) setCount(35);
            else setCount(50);
        };
        compute();
        window.addEventListener("resize", compute);
        return () => window.removeEventListener("resize", compute);
    }, []);

    // Genera los copos una sola vez con parámetros aleatorios
    const flakes = useMemo(
        () =>
            Array.from({ length: count }, () => {
                const size = 2 + Math.random() * 5; // 2-7px
                return {
                    id: Math.random().toString(36).slice(2),
                    left: Math.random() * 100, // %
                    size,
                    delay: -Math.random() * 20, // negativo: ya en caída al cargar
                    duration: 10 + Math.random() * 12, // 10-22s
                    opacity: 0.4 + Math.random() * 0.6,
                    drift: (Math.random() - 0.5) * 120, // deriva horizontal en px
                };
            }),
        [count]
    );

    if (!inSeason) return null;

    return (
        <div className="snowfall" aria-hidden="true">
            {flakes.map((f) => (
                <span
                    key={f.id}
                    className="snowflake"
                    style={
                        {
                            left: `${f.left}%`,
                            width: `${f.size}px`,
                            height: `${f.size}px`,
                            opacity: f.opacity,
                            animationDuration: `${f.duration}s`,
                            animationDelay: `${f.delay}s`,
                            "--drift": `${f.drift}px`,
                        } as React.CSSProperties
                    }
                />
            ))}
        </div>
    );
}