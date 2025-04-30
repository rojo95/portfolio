import { useContext } from "react";
import LoadingContext, {
    LoadingContextType,
} from "@context/LoadingContext";

// Hook para usar el contexto
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error(
            "useLoading debe ser usado dentro de un LoadingProvider"
        );
    }
    return context;
};
