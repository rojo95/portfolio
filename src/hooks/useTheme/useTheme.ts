import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "light" | "system" | "dark";

const STORAGE_KEY = "roman-theme";

/** Aplica o quita la clase `dark` en <html> según preferencia + sistema */
function applyTheme(pref: ThemePreference) {
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = pref === "dark" || (pref === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
}

/** Lee la preferencia guardada, o "system" por defecto */
function getInitialPreference(): ThemePreference {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    return stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
}

/**
 * Controla el tema claro/oscuro con 3 estados:
 * "light" | "system" (sigue al SO) | "dark". Persistido en localStorage.
 */
export function useTheme() {
    const [preference, setPreference] = useState<ThemePreference>(
        getInitialPreference
    );

    // Sincroniza la clase dark y persiste al cambiar la preferencia
    useEffect(() => {
        applyTheme(preference);
        localStorage.setItem(STORAGE_KEY, preference);
    }, [preference]);

    // Si está en "system", reacciona a cambios del SO en vivo
    useEffect(() => {
        if (preference !== "system") return;

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => applyTheme("system");
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, [preference]);

    const setTheme = useCallback(
        (next: ThemePreference) => setPreference(next),
        []
    );

    return { preference, setTheme };
}