import { useEffect, useRef, useState } from "react";
import { IoDesktop, IoMoon, IoSunny } from "react-icons/io5";
import { useTheme, ThemePreference } from "@hooks/useTheme/useTheme";

const OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "light", label: "Claro", icon: <IoSunny className="size-4" /> },
  { value: "system", label: "Sistema", icon: <IoDesktop className="size-4" /> },
  { value: "dark", label: "Oscuro", icon: <IoMoon className="size-4" /> },
];

/**
 * Interruptor de 3 posiciones (Claro | Sistema | Oscuro).
 * El pulgar se posiciona midiendo el DOM en vivo (offsetLeft del botón activo
 * menos el del propio pulgar, así se compensa el padding sin hardcodear nada)
 * y se mueve con transform: translateX (GPU-composited).
 */
export default function ThemeSwitch() {
  const { preference, setTheme } = useTheme();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumbX, setThumbX] = useState(0);

  const activeIndex = OPTIONS.findIndex((o) => o.value === preference);

  const positionThumb = () => {
    const thumb = thumbRef.current;
    const activeBtn = buttonRefs.current[activeIndex];
    if (!thumb || !activeBtn) return;
    setThumbX(activeBtn.offsetLeft - thumb.offsetLeft);
  };

  // Al montar y cada vez que cambia la selección
  useEffect(() => {
    positionThumb();
  }, [activeIndex]);

  // Re-posiciona tras reflows (resize, carga de fuentes, etc.)
  useEffect(() => {
    window.addEventListener("resize", () =>
      requestAnimationFrame(positionThumb),
    );
    return () =>
      window.removeEventListener("resize", () =>
        requestAnimationFrame(positionThumb),
      );
  }, [activeIndex]);

  return (
    <div
      ref={trackRef}
      role="group"
      aria-label="Modo claro/oscuro"
      title="Apariencia"
      className="relative inline-flex items-center rounded-full border border-black/20 bg-gray-700 p-1 shadow-inner dark:border-white/20 dark:bg-gray-900 dark:shadow-black/60"
    >
      {/* Pulgar deslizante */}
      <span
        ref={thumbRef}
        aria-hidden="true"
        className="absolute left-1 top-1 size-7 rounded-full dark:bg-cyan-400 bg-cyan-500 shadow-md ring-1 ring-cyan-300/60 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${thumbX}px)` }}
      />

      {OPTIONS.map(({ value, label, icon }, index) => {
        const active = preference === value;
        return (
          <button
            key={value}
            ref={(el) => (buttonRefs.current[index] = el)}
            type="button"
            title={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className="relative z-10 grid size-7 shrink-0 place-items-center appearance-none p-0 box-border rounded-full bg-transparent"
          >
            <span
              className={`absolute inset-0 grid place-items-center transition ${
                active
                  ? "text-gray-800"
                  : "text-gray-300 hover:text-white dark:text-gray-400"
              }`}
            >
              {icon}
            </span>
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
