import { useEffect, useMemo, useReducer, useRef, useState } from "react";
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
import useIntersectionList from "@hooks/useIntersectionList/useIntersectionList";

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

const urlBase = import.meta.env.BASE_URL;

function getTechClass(techId: number): string {
    switch (techId) {
        case TECH.REACT: return "react";
        case TECH.LARAVEL: return "laravel";
        case TECH.ANGULAR: return "angular";
        case TECH.IONIC: return "ionic";
        case TECH.VUE: return "vue";
        default: return "wordpress";
    }
}

function getTechImage(techId: number): string {
    switch (techId) {
        case TECH.REACT: return "react";
        case TECH.LARAVEL: return "laravel";
        case TECH.ANGULAR: return "angular";
        case TECH.IONIC: return "ionic";
        case TECH.VUE: return "vue";
        default: return "wordpress";
    }
}

/** Genera una clave única para cada tecnología, separando React de React Native */
function getFilterKey(t: { name: string; image?: string | null }): string | null {
    if (!t.image) return null;
    // Separar React de React Native (ambos usan "react.webp")
    if (t.image === "react.webp") {
        return t.name.toLowerCase().includes("react native")
            ? "react-native"
            : "react";
    }
    return t.image;
}

export default function Projects() {
    const { t } = useTranslation();
    const { loading } = useLoading();
    const [data, setData] = useState<Project[]>([]);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const imagesLoaded = useRef<Set<number>>(new Set());
    const hoveredCard = useRef<{
        el: HTMLDivElement;
        cleanup: () => void;
    } | null>(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    // Filter state
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [prevFilterData, setPrevFilterData] = useState<Project[]>([]);
    const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);

    // Panel scroll fade state
    const panelRef = useRef<HTMLDivElement>(null);
    const [panelScrollInfo, setPanelScrollInfo] = useState({
        scrollable: false,
        atTop: true,
        atBottom: true,
    });

    // Extract unique technologies from all projects (con React/React Native separados)
    const techFilters = useMemo(() => {
        const techMap = new Map<string, { image: string; name: string }>();
        data.forEach((project) => {
            project.tech.forEach((t) => {
                const key = getFilterKey(t);
                if (key && !techMap.has(key)) {
                    techMap.set(key, {
                        image: t.image || "",
                        name: key === "react"
                            ? "React"
                            : key === "react-native"
                                ? "React Native"
                                : t.name,
                    });
                }
            });
        });
        return Array.from(techMap.values());
    }, [data]);

    /** Revisa si un proyecto coincide con una clave de filtro */
    function projectMatchesFilter(project: Project, filterKey: string): boolean {
        return project.tech.some((t) => getFilterKey(t) === filterKey);
    }

    // Filter projects by selected technology
    const filteredData = useMemo(() => {
        if (!activeFilter) return data;
        return data.filter((project) => projectMatchesFilter(project, activeFilter));
    }, [data, activeFilter]);

    // Convierte un tech filter a la clave de filtro (separa React de React Native)
    const getTechFilterKey = (tech: { image: string; name: string }): string =>
        tech.image === "react.webp"
            ? (tech.name === "React Native" ? "react-native" : "react")
            : tech.image;

    // Data to render: during transition show previous data exiting, otherwise show filtered
    const displayData = isFilterTransitioning ? prevFilterData : filteredData;

    const handleFilterClick = (key: string | null) => {
        if (isFilterTransitioning) return;
        if (key === activeFilter) return;

        // Snapshot current visible data for exit animation
        setPrevFilterData(displayData);
        setIsFilterTransitioning(true);

        // Wait for exit animation to complete, then update filter
        setTimeout(() => {
            setActiveFilter(key);
            setIsFilterTransitioning(false);
        }, 400);
    };

    const [cardRefs, visibleMap] = useIntersectionList({
        count: displayData.length,
        options: { rootMargin: "100px" },
    });

    const updateCardEffect = (card: HTMLDivElement, pos: [number, number]) => {
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

        card.style.setProperty("--gx", `${lp}%`);
        card.style.setProperty("--gy", `${tp}%`);
        card.style.setProperty("--sx", `${px_spark}%`);
        card.style.setProperty("--sy", `${py_spark}%`);
        card.style.setProperty("--op", `${p_opc / 100}`);
        card.style.transform = `rotateX(${ty}deg) rotateY(${tx}deg)`;
    };

    const handleMouseEnter = (el: HTMLDivElement) => {
        if (isSmallScreen) return;

        if (hoveredCard.current) {
            hoveredCard.current.cleanup();
        }

        el.classList.remove("animated");

        let rafId: number;
        let lastPos: [number, number] | null = null;

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            let pos: [number, number];
            e.preventDefault();
            if ("touches" in e) {
                pos = [e.touches[0].clientX, e.touches[0].clientY];
            } else {
                pos = [e.offsetX, e.offsetY];
            }

            if (
                lastPos &&
                Math.abs(pos[0] - lastPos[0]) < 3 &&
                Math.abs(pos[1] - lastPos[1]) < 3
            ) {
                return;
            }
            lastPos = pos;

            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => updateCardEffect(el, pos));
        };

        const handleMouseLeave = () => {
            cancelAnimationFrame(rafId);
            el.removeAttribute("style");
            setTimeout(() => {
                el.classList.add("animated");
            }, 2500);
        };

        el.addEventListener("mousemove", handleMouseMove, { passive: true });
        el.addEventListener("touchmove", handleMouseMove, { passive: true });
        el.addEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("touchend", handleMouseLeave);
        el.addEventListener("touchcancel", handleMouseLeave);

        hoveredCard.current = {
            el,
            cleanup: () => {
                cancelAnimationFrame(rafId);
                el.removeEventListener("mousemove", handleMouseMove);
                el.removeEventListener("touchmove", handleMouseMove);
                el.removeEventListener("mouseleave", handleMouseLeave);
                el.removeEventListener("touchend", handleMouseLeave);
                el.removeEventListener("touchcancel", handleMouseLeave);
                el.removeAttribute("style");
            },
        };
    };

    const handleMouseLeave = () => {
        if (hoveredCard.current) {
            hoveredCard.current.cleanup();
            hoveredCard.current = null;
        }
    };

    const handleImageLoad = (index: number) => {
        imagesLoaded.current.add(index);
        forceUpdate();
    };

    async function getProjects() {
        try {
            const data = await fetchProjects();
            if (!data) return;
            const { projects } = data;
            setData(projects);
            imagesLoaded.current = new Set();
        } catch (error) {
            console.error(error);
        }
    }

    // Detectar scroll en el panel para aplicar fade
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const updateScrollInfo = () => {
            const scrollable = panel.scrollHeight > panel.clientHeight + 2;
            const atTop = panel.scrollTop <= 4;
            const atBottom =
                panel.scrollTop + panel.clientHeight >=
                panel.scrollHeight - 4;
            setPanelScrollInfo({ scrollable, atTop, atBottom });
        };

        updateScrollInfo();
        panel.addEventListener("scroll", updateScrollInfo, { passive: true });
        const observer = new ResizeObserver(updateScrollInfo);
        observer.observe(panel);

        return () => {
            panel.removeEventListener("scroll", updateScrollInfo);
            observer.disconnect();
        };
    }, [techFilters]);

    const getPanelMaskClass = (): string => {
        const { scrollable, atTop, atBottom } = panelScrollInfo;
        if (!scrollable) return "";
        if (!atTop && !atBottom) return "mask-both";
        if (!atTop) return "mask-top";
        if (!atBottom) return "mask-bottom";
        return "";
    };

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
            if (hoveredCard.current) {
                hoveredCard.current.cleanup();
            }
        };
    }, []);

    return (
        <>
            <title>{`Johan Román - ${t("links.projects")}`}</title>
            <div className="projects-layout">
                {/* ===== PANEL LATERAL (DESKTOP) ===== */}
                {data.length > 0 && (
                    <aside
                        ref={panelRef}
                        className={`tech-filter-panel hide-mobile ${getPanelMaskClass()}`}
                    >
                        <button
                            className={`panel-filter-btn ${activeFilter === null ? "active" : ""}`}
                            onClick={() => handleFilterClick(null)}
                            title={t("views.project.all")}
                        >
                            <span className="all-label">{t("views.project.all")}</span>
                        </button>
                        <div className="panel-divider" />
                        {techFilters.map((tech) => {
                            const filterKey = getTechFilterKey(tech);
                            return (
                                <button
                                    key={filterKey}
                                    className={`panel-filter-btn ${activeFilter === filterKey ? "active" : ""}`}
                                    onClick={() => handleFilterClick(filterKey)}
                                    title={tech.name}
                                >
                                    <img
                                        src={`images/knowledge/${tech.image}`}
                                        alt={tech.name}
                                    />
                                </button>
                            );
                        })}
                    </aside>
                )}

                {/* ===== BARRA HORIZONTAL (MOBILE) ===== */}
                {data.length > 0 && (
                    <div className="tech-filter-wrapper-mobile hide-desktop">
                        <div className="tech-filter-bar-mobile">
                            <button
                                className={`mobile-filter-btn ${activeFilter === null ? "active" : ""}`}
                                onClick={() => handleFilterClick(null)}
                                title={t("views.project.all")}
                            >
                                <span className="all-label">{t("views.project.all")}</span>
                            </button>
                            {techFilters.map((tech) => {
                                const filterKey = getTechFilterKey(tech);
                                return (
                                    <button
                                        key={filterKey}
                                        className={`mobile-filter-btn ${activeFilter === filterKey ? "active" : ""}`}
                                        onClick={() => handleFilterClick(filterKey)}
                                        title={tech.name}
                                    >
                                        <img
                                            src={`images/knowledge/${tech.image}`}
                                            alt={tech.name}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <section className="cards">
                    {!data || loading ? (
                        <>{t("loading")}...</>
                    ) : displayData.length === 0 ? (
                        <p className="text-white/60 text-lg mt-10">
                            {t("projects.noResults") || "No projects found"}
                        </p>
                    ) : (
                        displayData.map((values, key) => (
                            <Link
                                href={`${urlBase}projects/${values.id}`}
                                key={values.id}
                                className={`${isFilterTransitioning ? "fade-out-filter" : "fade-in"}`}
                                style={{
                                    animationDelay: isFilterTransitioning
                                        ? "0s"
                                        : `${key * 0.15}s`,
                                }}
                            >
                                <div
                                    ref={(el) => { cardRefs.current[key] = el; }}
                                    className={`card z-0 transition ${getTechClass(values.primaryTech)} ${isSmallScreen
                                        ? ""
                                        : "animated disable-touch"
                                        } cursor-pointer relative
                                        ${!visibleMap[key] ? "paused" : ""}`}
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
                                    {!imagesLoaded.current.has(key) && (
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
                                                    src={`images/knowledge/${getTechImage(values.primaryTech)}.webp`}
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
            </div>
        </>
    );
}
