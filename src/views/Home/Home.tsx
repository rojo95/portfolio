import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import useIntersection from "@hooks/useIntersection/useIntersection";
import imagen from "@assets/images/johan.webp";
import "./Home.css";
import { useLoading } from "@hooks/useLoading/useLoading";

export default function PresentationSection() {
    const { t } = useTranslation();
    const { loading } = useLoading();
    const [animationRunning, setAnimationRunning] = useState<boolean>(false);
    const [photoRef, photoIsIntersecting] = useIntersection({
        options: {
            threshold: 0.5,
        },
    });
    const [presentationRef, presentationIsIntersecting] = useIntersection({
        options: {
            threshold: 0.5,
        },
    });

    function calculateYears(date: Date) {
        // Get the current date
        const currentDate = new Date();

        // Calculate the difference in years
        let yearDifference = currentDate.getFullYear() - date.getFullYear();

        // Adjust if the current date has not yet occurred this year
        if (
            currentDate.getMonth() < date.getMonth() ||
            (currentDate.getMonth() === date.getMonth() &&
                currentDate.getDate() < date.getDate())
        ) {
            yearDifference -= 1;
        }

        return yearDifference;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setAnimationRunning(true);

            setTimeout(() => {
                setAnimationRunning(false);
            }, 1800);
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="px-4 md:px-40 py-10">
            <title>{`Johan Román - ${t("links.home")}`}</title>
            <div className="grid grid-1 md:grid-cols-2 gap-4">
                <div
                    className={`place-content-center transition duration-500 ${
                        presentationIsIntersecting && !loading
                            ? "opacity-100 pointer-events-auto translate-x-0"
                            : "opacity-0 pointer-events-none -translate-x-10"
                    }`}
                    ref={presentationRef}
                >
                    <div className="text-justify">
                        <h1
                            className={`writer title mb-4 ${
                                animationRunning ? "glitch" : ""
                            }`}
                        >
                            <span aria-hidden="true">Johan A. Román</span>
                            Johan A. Román
                            <span aria-hidden="true">Johan A. Román</span>
                        </h1>
                        <p className="text mb-5">
                            {t("hello-i-am", {
                                years: calculateYears(new Date("2017-04-01")),
                            })}
                        </p>
                        <Link
                            href="/projects"
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-semibold text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none dark:focus:ring-cyan-800 shadow-xl hover:shadow-cyan-500/50 transition"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                {t("links.projects").toUpperCase()}
                            </span>
                        </Link>
                    </div>
                </div>
                <div
                    className={`flex items-center justify-center transition duration-500 ${
                        photoIsIntersecting
                            ? "opacity-100 pointer-events-auto translate-x-0"
                            : "opacity-0 pointer-events-none translate-x-10"
                    }`}
                    ref={photoRef}
                >
                    <div className="lg:size-[650px]">
                        <div className="image-container transition dark:hover:drop-shadow-[0_10px_10px_rgba(22,205,229,0.8)] hover:drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] cursor-pointer">
                            <Link href="/about">
                                <div className="glitch-image-container">
                                    <img src={imagen} alt="Johan" />
                                    <div className="glitch__layers">
                                        <div
                                            className={
                                                animationRunning
                                                    ? "glitch__layer"
                                                    : ""
                                            }
                                        ></div>
                                        <div
                                            className={
                                                animationRunning
                                                    ? "glitch__layer"
                                                    : ""
                                            }
                                        ></div>
                                        <div
                                            className={
                                                animationRunning
                                                    ? "glitch__layer"
                                                    : ""
                                            }
                                        ></div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
