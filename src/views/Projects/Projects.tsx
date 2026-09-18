import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import useTilt from "@hooks/useTilt/useTilt";
import { useViewExit } from "@hooks/useViewTransition/useViewTransition";

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

const TILT = {
    MAX: 18,
    PERSPECTIVE: 1000,
    SCALE: 1.02,
} as const;

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

interface ProjectCardProps {
    project: Project;
    index: number;
    count: number;
    isSmallScreen: boolean;
    isFilterTransitioning: boolean;
    isLeaving: boolean;
    isVisible: boolean;
    setCardRef: (index: number, el: HTMLDivElement | null) => void;
}

const ProjectCard = memo(function ProjectCard({
    project,
    index,
    count,
    isSmallScreen,
    isFilterTransitioning,
    isLeaving,
    isVisible,
    setCardRef,
}: ProjectCardProps) {
    const cardElRef = useRef<HTMLDivElement | null>(null);
    const reanimateTimer = useRef<number | null>(null);
    const [thumbLoaded, setThumbLoaded] = useState(false);
    const { onMouseEnter: tiltEnter, onMouseMove: tiltMove, onMouseLeave: tiltLeave } =
        useTilt<HTMLDivElement>({
            ref: cardElRef,
            max: TILT.MAX,
            perspective: TILT.PERSPECTIVE,
            scale: TILT.SCALE,
            disabled: isSmallScreen,
        });

    const combineRef = useCallback(
        (el: HTMLDivElement | null) => {
            cardElRef.current = el;
            setCardRef(index, el);
        },
        [index, setCardRef]
    );

    const handleMouseEnter = () => {
        if (isSmallScreen) return;
        const el = cardElRef.current;
        if (!el) return;
        if (reanimateTimer.current !== null) {
            window.clearTimeout(reanimateTimer.current);
            reanimateTimer.current = null;
        }
        el.classList.remove("animated");
        tiltEnter();
    };

    const handleCardMouseLeave = () => {
        if (isSmallScreen) return;
        const el = cardElRef.current;
        if (!el) return;
        tiltLeave();
        reanimateTimer.current = window.setTimeout(() => {
            el.classList.add("animated");
            reanimateTimer.current = null;
        }, 2500);
    };

    useEffect(() => {
        return () => {
            if (reanimateTimer.current !== null) {
                window.clearTimeout(reanimateTimer.current);
            }
        };
    }, []);

    return (
        <Link
            href={`${urlBase}projects/${project.id}`}
            className={`${
                isFilterTransitioning || isLeaving
                    ? "fade-out-filter"
                    : "fade-in"
            }`}
            style={{
                animationDelay: isFilterTransitioning
                    ? "0s"
                    : isLeaving
                        ? `${(count - 1 - index) * 0.15}s`
                        : `${index * 0.15}s`,
            }}
        >
            <div
                ref={combineRef}
                className={`card z-0 transition ${getTechClass(project.primaryTech)} ${isSmallScreen
                    ? ""
                    : "animated"
                    } cursor-pointer relative
                    ${!isVisible ? "paused" : ""}`}
                style={{
                    animationDelay: `${index * 0.5}s`,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseMove={tiltMove}
                onMouseLeave={handleCardMouseLeave}
            >
                {!thumbLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
                        <img
                            className="proj-thumb blur"
                            src={loadingProjImg}
                            alt={`loading-${index}`}
                        />
                        <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
                    </div>
                )}
                <>
                    <img
                        className="proj-thumb"
                        src={`images/projects/${project.thumb}`}
                        alt="background"
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setThumbLoaded(true)}
                    />
                    <div className="z-10 pointer-events-none absolute top-4 left-4 grid grid-cols-1 gap-1">
                        <div className="hexagon bg-gray-200 size-10 grid place-items-center">
                            <img
                                width={30}
                                src={`images/knowledge/${getTechImage(project.primaryTech)}.webp`}
                                alt={"knowledge" + project.primaryTech}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        {project.platforms.includes(PLATFORMS.DESKTOP) ? (
                            <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                <FaDesktop className="size-4" />
                            </div>
                        ) : null}

                        {project.platforms.includes(PLATFORMS.TABLET) ? (
                            <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                <FaTabletScreenButton className="size-4" />
                            </div>
                        ) : null}

                        {project.platforms.includes(PLATFORMS.MOBILE) ? (
                            <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                <FaMobileScreen className="size-4" />
                            </div>
                        ) : null}

                        {project.platforms.includes(PLATFORMS.ANDROID) ? (
                            <div className="rounded-full size-6 grid place-items-center bg-gray-200 text-black">
                                <DiAndroid className="size-4" />
                            </div>
                        ) : null}
                    </div>
                    <p className="z-10 proj-title absolute py-2 px-3 text-sm font-semibold border-text text-gray-800 z-0 bottom-10 w-full text-center pointer-events-none">
                        {project.title}
                    </p>
                </>
            </div>
        </Link>
    );
});

export default function Projects() {
    const { t } = useTranslation();
    const { loading } = useLoading();
    const [data, setData] = useState<Project[]>([]);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const [leaving, setLeaving] = useState<boolean>(false);
    const displayDataRef = useRef(0);
    const exitTimerRef = useRef<number | null>(null);

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

    const setCardRef = useCallback((index: number, el: HTMLDivElement | null) => {
        cardRefs.current[index] = el;
    }, [cardRefs]);

    async function getProjects() {
        try {
            const data = await fetchProjects();
            if (!data) return;
            const { projects } = data;
            setData(projects);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        displayDataRef.current = displayData.length;
    });

    const EXIT_STAGGER_MS = 150;
    const EXIT_DURATION_MS = 350;

    function exitDurationFor(count: number): number {
        if (count <= 0) return EXIT_DURATION_MS;
        return (count - 1) * EXIT_STAGGER_MS + EXIT_DURATION_MS;
    }

    const handleExit = useCallback(() => {
        return new Promise<void>((resolve) => {
            setLeaving(true);
            if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
            exitTimerRef.current = window.setTimeout(
                resolve,
                exitDurationFor(displayDataRef.current)
            );
        });
    }, []);

    useViewExit(handleExit);

    useEffect(() => {
        return () => {
            if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
        };
    }, []);

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
        };
    }, []);

    useEffect(() => {
        document.title = `Johan Román - ${t("links.projects")}`;
    }, [t]);

    return (
        <>
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
                                        loading="lazy"
                                        decoding="async"
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
                                            loading="lazy"
                                            decoding="async"
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
                            <ProjectCard
                                key={values.id}
                                project={values}
                                index={key}
                                count={displayData.length}
                                isSmallScreen={isSmallScreen}
                                isFilterTransitioning={isFilterTransitioning}
                                isLeaving={leaving}
                                isVisible={!!visibleMap[key]}
                                setCardRef={setCardRef}
                            />
                        ))
                    )}
                </section>
            </div>
        </>
    );
}