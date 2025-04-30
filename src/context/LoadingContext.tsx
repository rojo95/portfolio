import React, { createContext, useState, ReactNode } from "react";

// Definir la forma del contexto
export interface LoadingContextType {
    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

// Crear el contexto con un valor por defecto
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Proveedor del contexto
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingContext;
