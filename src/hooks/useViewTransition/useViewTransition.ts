import { useEffect, useRef } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";
import type { BrowserLocationHook } from "wouter/use-browser-location";

export type ViewExitHandler = () => Promise<void>;

export const EXIT_SPEED = 1.5;

let exitHandler: ViewExitHandler | null = null;
let navigationInFlight = false;
let pendingNavigation: (() => void) | null = null;

export function useViewExit(handler: ViewExitHandler) {
    const handlerRef = useRef<ViewExitHandler>(handler);
    handlerRef.current = handler;

    useEffect(() => {
        exitHandler = () => handlerRef.current();
        return () => {
            exitHandler = null;
            pendingNavigation = null;
            navigationInFlight = false;
        };
    }, []);
}

const normalize = (path: string) =>
    path.length > 1 ? path.replace(/\/+$/, "") : path;

const toPath = (to: string | URL) =>
    to instanceof URL ? to.pathname : to;

export const useViewTransition: BrowserLocationHook = (options) => {
    const [location, setLocation] = useBrowserLocation(options);

    const navigate = (
        to: string | URL,
        options?: { replace?: boolean; state?: unknown }
    ) => {
        // Si el destino es la ruta ya activa, no hay nada que animar: la URL
        // no cambiaria, la vista no se remontaria y quedaria congelada en su
        // animacion de salida.
        if (normalize(toPath(to)) === normalize(location)) return;

        const perform = () => setLocation(to, options);

        const handler = exitHandler;
        if (!handler) {
            perform();
            return;
        }

        if (navigationInFlight) {
            pendingNavigation = perform;
            return;
        }

        navigationInFlight = true;
        Promise.resolve(handler()).finally(() => {
            navigationInFlight = false;
            perform();

            const next = pendingNavigation;
            pendingNavigation = null;
            if (next) next();
        });
    };

    return [location, navigate];
};