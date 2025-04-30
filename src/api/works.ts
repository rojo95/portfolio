import axios, { AxiosResponse } from "axios";
import { Skills } from "./projects";

const URL_BASE = import.meta.env.BASE_URL;

export type Work = {
    name: string;
    shortName: string;
    image: string;
    logo: string;
    idCard?: string;
    startDate: string;
    endDate: string;
    position: string;
    roles: string[];
    rolesDescription: string;
    skills: Skills[];
    frameworks: string[];
    description?: string;
};

export const fetchWorks = async (): Promise<Work[] | null> => {
    try {
        const response: AxiosResponse<Work[]> = await axios.get(
            `${URL_BASE}info/works.json`
        );
        return response.data; // Retorna solo los datos
    } catch (error) {
        console.error("Error fetching works:", error);
        return null; // O maneja el error de otra manera según tus necesidades
    }
};
