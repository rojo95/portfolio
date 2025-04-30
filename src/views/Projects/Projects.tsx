import { useEffect, useRef, useState } from "react";
import "./Projects.css";
import { useTranslation } from "react-i18next";
import { fetchProjects, Project } from "@api/projects";
import { DiAndroid } from "react-icons/di";
import {
    FaDesktop,
    FaMobileScreen,
    FaTabletScreenButton,
} from "react-icons/fa6";
import { Link } from "wouter";
import { useLoading } from "@hooks/useLoading/useLoading";
import loadingProjImg from "@assets/images/loading-project.webp";

const TECH = {
    REACT: 1,
    LARAVEL: 2,
    ANGULAR: 3,
    IONIC: 4,
    VUE: 5,
    WORDPRESS: 6,
    REACT_NATIVE: 7,
} as const;

const PLATFORMS = {
    DESKTOP: 1,
    TABLET: 2,
    MOBILE: 3,
    ANDROID: 4,
} as const;

export default function Projects() {
    const { t } = useTranslation();
    const { loading } = useLoading();
    const refCard = useRef<HTMLDivElement | null>(null);
    const [data, setData] = useState<Project[]>([]);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

    const handleMouseEnter = (el: HTMLDivElement) => {
        refCard.current = el;
        if (!refCard.current) return;

        const style = document.querySelector<HTMLStyleElement>(".hover");
        let x: NodeJS.Timeout;

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            let pos: [number, number] = [0, 0];
            e.preventDefault();
            if ("touches" in e) {
                pos = [e.touches[0].clientX, e.touches[0].clientY];
            } else {
                pos = [e.offsetX, e.offsetY];
            }

            const card = refCard.current!;
            const l = pos[0];
            const t = pos[1];
            const h = card.clientHeight;
            const w = card.clientWidth;
            const px = Math.abs(Math.floor((100 / w) * l) - 100);
            const py = Math.abs(Math.floor((100 / h) * t) - 100);
            const pa = 50 - px + (50 - py);
            const lp = 50 + (px - 50) / 1.5;
            const tp = 50 + (py - 50) / 1.5;
            const px_spark = 50 + (px - 50) / 7;
            const py_spark = 50 + (py - 50) / 7;
            const p_opc = 20 + Math.abs(pa) * 1.5;
            const ty = ((tp - 50) / 2) * -1;
            const tx = ((lp - 50) / 1.5) * 0.5;

            const grad_pos = `background-position: ${lp}% ${tp}%;`;
            const sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`;
            const opc = `opacity: ${p_opc / 100};`;
            const tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`;

            const styleContent = `
                .card:hover:before { ${grad_pos} }
                .card:hover:after { ${sprk_pos} ${opc} }
            `;

            card.classList.remove("animated");
            card.setAttribute("style", tf);
            if (style) {
                style.innerHTML = styleContent;
            }

            if ("touches" in e) {
                return false;
            }
            clearTimeout(x);
        };

        const handleMouseOut = () => {
            const card = refCard.current;
            if (!card) return;

            if (style) {
                style.innerHTML = "";
            }
            card.removeAttribute("style");

            x = setTimeout(() => {
                card.classList.add("animated");
            }, 2500);
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("touchmove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseOut);
        el.addEventListener("touchend", handleMouseOut);
        el.addEventListener("touchcancel", handleMouseOut);

        // Guardar los manejadores en el elemento para poder eliminarlos después
        el.dataset.eventHandlers = JSON.stringify({
            handleMouseMove,
            handleMouseOut,
        });
    };

    const handleMouseLeave = () => {
        if (!refCard.current) return;

        const el = refCard.current!;
        if (!el.dataset.eventHandlers) return;

        const { handleMouseMove, handleMouseOut } = JSON.parse(
            el.dataset.eventHandlers
        );

        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("touchmove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseOut);
        el.removeEventListener("touchend", handleMouseOut);
        el.removeEventListener("touchcancel", handleMouseOut);

        el.removeAttribute("data-event-handlers");
        el.removeAttribute("style");
    };

    const handleImageLoad = (index: number) => {
        console.log("cargado: ", index);

        setImagesLoaded((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    };

    async function getProjects() {
        try {
            const data = await fetchProjects();
            if (!data) return;

            const { projects } = data;

            setData(projects);
            setImagesLoaded(Array(projects.length).fill(false));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleMediaQueryChange = (e: MediaQueryListEvent) => {
            setIsSmallScreen(e.matches);
        };

        setIsSmallScreen(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleMediaQueryChange);

        getProjects();

        return () => {
            mediaQuery.removeEventListener("change", handleMediaQueryChange);
        };
    }, []);

    return (
        <>
            <title>{`Johan Román - ${t("links.projects")}`}</title>
            <div className="flex items-center justify-center relative">
                <section className="cards">
                    {!data || loading ? (
                        <>{t("loading")}...</>
                    ) : (
                        data.map((values, key) => (
                            <Link
                                href={`/projects/${values.id}`}
                                key={key}
                                className={`${
                                    loading ? "fade-out" : "fade-in"
                                }`}
                                style={{
                                    animationDelay: loading
                                        ? "0s"
                                        : `${key * 0.2}s`,
                                }}
                            >
                                <div
                                    className={`card z-0 transition ${
                                        values.primaryTech === TECH.REACT
                                            ? "react"
                                            : values.primaryTech ===
                                              TECH.LARAVEL
                                            ? "laravel"
                                            : values.primaryTech ===
                                              TECH.ANGULAR
                                            ? "angular"
                                            : values.primaryTech === TECH.IONIC
                                            ? "ionic"
                                            : values.primaryTech === TECH.VUE
                                            ? "vue"
                                            : "wordpress"
                                    } ${
                                        isSmallScreen
                                            ? ""
                                            : "animated disable-touch"
                                    } cursor-pointer relative`}
                                    style={{
                                        animationDelay: `${key * 0.5}s`,
                                    }}
                                    onMouseEnter={(e) =>
                                        !isSmallScreen &&
                                        handleMouseEnter(e.currentTarget)
                                    }
                                    onMouseLeave={() =>
                                        !isSmallScreen && handleMouseLeave()
                                    }
                                >
                                    {!imagesLoaded[key] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
                                            <img
                                                className="proj-thumb blur"
                                                src={loadingProjImg}
                                                alt={`loading-${key}`}
                                            />
                                            <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
                                        </div>
                                    )}
                                    <>
                                        <img
                                            className="proj-thumb"
                                            src={`images/projects/${values.thumb}`}
                                            alt="background"
                                            onLoad={() => handleImageLoad(key)}
                                        />
                                        <div className="z-10 pointer-events-none absolute top-4 left-4 grid grid-cols-1 gap-1">
                                            <div className="hexagon bg-gray-200 size-10 grid place-items-center">
                                                <img
                                                    width={30}
                                                    src={`images/knowledge/${
                                                        values.primaryTech ===
                                                        TECH.REACT
                                                            ? "react"
                                                            : values.primaryTech ===
                                                              TECH.LARAVEL
                                                            ? "laravel"
                                                            : values.primaryTech ===
                                                              TECH.ANGULAR
                                                            ? "angular"
                                                            : values.primaryTech ===
                                                              TECH.IONIC
                                                            ? "ionic"
                                                            : values.primaryTech ===
                                                              TECH.VUE
                                                            ? "vue"
                                                            : "wordpress"
                                                    }.webp`}
                                                    alt={
                                                        "knowledge" +
                                                        values.primaryTech
                                                    }
                                                />
                                            </div>
                                            {values.platforms.includes(
                                                PLATFORMS.DESKTOP
                                            ) ? (
                                                <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                                    <FaDesktop className="size-4" />
                                                </div>
                                            ) : null}

                                            {values.platforms.includes(
                                                PLATFORMS.TABLET
                                            ) ? (
                                                <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                                    <FaTabletScreenButton className="size-4" />
                                                </div>
                                            ) : null}

                                            {values.platforms.includes(
                                                PLATFORMS.MOBILE
                                            ) ? (
                                                <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                                    <FaMobileScreen className="size-4" />
                                                </div>
                                            ) : null}

                                            {values.platforms.includes(
                                                PLATFORMS.ANDROID
                                            ) ? (
                                                <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                                    <DiAndroid className="size-4" />
                                                </div>
                                            ) : null}
                                        </div>
                                        <p className="z-10 proj-title absolute py-2 px-3 text-sm font-semibold border-text text-gray-800 z-0 bottom-10 w-full text-center pointer-events-none">
                                            {values.title}
                                        </p>
                                    </>
                                </div>
                            </Link>
                        ))
                    )}
                </section>
                <style className="hover"></style>
            </div>
        </>
    );
}
