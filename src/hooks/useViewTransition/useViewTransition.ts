import { useEffect, useRef } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";
import type { BrowserLocationHook } from "wouter/use-browser-location";

export type ViewExitHandler = () => Promise<void>;

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

export const useViewTransition: BrowserLocationHook = (options) => {
    const [location, setLocation] = useBrowserLocation(options);

    const navigate = (
        to: string | URL,
        options?: { replace?: boolean; state?: unknown }
    ) => {
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