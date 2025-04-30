import axios, { AxiosResponse } from "axios";

const URL_BASE = "/";

export type Category = {
    id: number;
    name: string;
};

export type Technology = {
    id: number;
    category_id: number;
    name: string;
    img: string;
    link: string;
    lang?: string | null;
    description?: string | null;
};

export type SkillsData = {
    categories: Category[];
    technologies: Technology[];
};

export const fetchSkills = async (): Promise<SkillsData | null> => {
    try {
        const response: AxiosResponse<SkillsData> = await axios.get(
            `${URL_BASE}info/skills.json`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return null;
    }
};
