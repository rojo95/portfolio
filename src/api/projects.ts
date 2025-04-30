import axios, { AxiosResponse } from "axios";

const URL_BASE = "/portfolio/";

export type Skills = {
    id: number;
    name: string;
    desc: string;
    image?: string;
    docs?: string;
    hidden?: boolean;
};

export type Project = {
    id: number;
    title: string;
    platforms: number[];
    type: string[];
    thumb: string;
    description: string;
    demo?: string;
    repo?: string;
    primaryTech: number;
    tech: Skills[];
    gallery?: {
        img: string;
        desc: string;
    }[];
};

export type ProjectsData = {
    projects: Project[];
};

export const fetchProjects = async (): Promise<ProjectsData | null> => {
    try {
        const response: AxiosResponse<ProjectsData> = await axios.get(
            `${URL_BASE}info/projects.json`
        );
        return response.data; // Retorna solo los datos
    } catch (error) {
        console.error("Error fetching projects:", error);
        return null; // O maneja el error de otra manera según tus necesidades
    }
};

export const fetchProjectById = async (id: number): Promise<Project | null> => {
    try {
        const response: AxiosResponse<ProjectsData> = await axios.get(
            `${URL_BASE}info/projects.json`
        );
        const project =
            response.data.projects.find((proj) => proj.id === id) || null;

        return project;
    } catch (error) {
        console.error("Error fetching project:", error);
        return null; // Manejo de errores
    }
};
