import "./About.css";
import usa from "@assets/images/usa.webp";
import portugal from "@assets/images/portugal.webp";
import brazil from "@assets/images/brazil.webp";
import venezuela from "@assets/images/venezuela.webp";
import LanguageImage from "@components/LanguageImage/LanguageImage";
import SpeechBooble from "@components/SpeechBooble/SpeechBooble";
import chibbyYo from "@assets/images/chibby_yo.webp";
import chibbyThink from "@assets/images/chibby_yo_pensando.webp";
import useIntersection from "@hooks/useIntersection/useIntersection";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import { useLoading } from "@hooks/useLoading/useLoading";
import cedula from "@assets/images/cedula.webp";
import { useEffect, useState } from "react";
import { Category, fetchSkills, Technology } from "@api/skills";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function About() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const [skills, setSkills] = useState<Technology[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCat, setSelectedCat] = useState<number>(0);
    const [showPtPhoto, setShowPtPhoto] = useState<boolean>(false);
    const [changingSkills, setChangingSkills] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);

    const { loading, startLoading, stopLoading } = useLoading();

    const [aboutTextRef, aboutTextIsIntersecting] = useIntersection({
        options: {
            threshold: 0.5,
        },
    });
    const [ocRef, ocIsIntersecting] = useIntersection({
        options: {
            threshold: 0.8,
        },
    });
    const [elemRefEs, refEsIsIntersecting] = useIntersection({
        options: {
            threshold: 0.5,
        },
    });
    const [elemRefEn, refEnIsIntersecting] = useIntersection({
        options: {
            threshold: 0.5,
        },
    });
    const [elemRefPt, refPtIsIntersecting] = useIntersection({
        options: {
            threshold: 0.5,
        },
    });

    const [educationRef, educationIsIntersecting] = useIntersection({
        options: {
            threshold: 0.5,
        },
    });
    const [skillsRef, skillsIsIntersecting] = useIntersection({
        options: {
            threshold: 0.2,
        },
    });

    function updateLang(lang: string) {
        if (lang === currentLanguage) return;
        startLoading();

        setTimeout(() => {
            changeLanguage(lang);
            stopLoading();
        }, 700);
    }

    useEffect(() => {
        const intervalo = setInterval(() => setShowPtPhoto(!showPtPhoto), 5000);

        return () => clearInterval(intervalo);
    }, [showPtPhoto]);

    const LANGS = {
        ES: "es",
        EN: "en",
        PT: "pt",
    } as const;

    async function getSkills() {
        const data = await fetchSkills();
        if (!data) return;
        const { categories, technologies } = data;

        setSelectedCat(categories[0].id);

        setCategories(categories);
        setSkills(technologies);
    }

    useEffect(() => {
        getSkills();
    }, []);

    function handleChangeCategorySkills(category: number) {
        if (selectedCat === category) return;
        setShowCategories(!showCategories);
        setChangingSkills(true);
        setTimeout(() => {
            setChangingSkills(false);
            setSelectedCat(category);
        }, 300);
    }

    function handleMenuSkills() {
        setShowCategories(!showCategories);
    }

    return (
        <>
            <title>{`Johan Román - ${t("links.about")}`}</title>
            <div className="px-4 lg:px-20 xl:px-40 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className={`flex items-center`} ref={aboutTextRef}>
                        <div
                            className={`py-3 transition duration-500 ${
                                aboutTextIsIntersecting && !loading
                                    ? "opacity-100 pointer-events-auto translate-x-0"
                                    : "opacity-0 pointer-events-none -translate-x-10"
                            }`}
                        >
                            <div className="text-justify">
                                <h1>{t("views.about.titles.about")}</h1>
                                <p className="">{t("about-me")}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`h-[350px] flex justify-center `}>
                        <div
                            className={`flex mb-20 justify-center items-center relative transition duration-500 perspective-dramatic ${
                                ocIsIntersecting
                                    ? "opacity-100 pointer-events-auto translate-x-0"
                                    : "opacity-0 pointer-events-none translate-x-10"
                            }`}
                            ref={ocRef}
                        >
                            <div className="speech-bubble">
                                <SpeechBooble
                                    text={!loading ? t("hi") : "..."}
                                    side={"bottom"}
                                />
                            </div>
                            <div className="id-card-container">
                                <p className="name">Johan A.</p>
                                <p className="lastname">Román</p>
                                {!loading ? (
                                    <img
                                        src={chibbyYo}
                                        alt="chibby_yo"
                                        className="me"
                                    />
                                ) : (
                                    <img
                                        src={chibbyThink}
                                        alt="chibby_yo"
                                        className="me"
                                    />
                                )}
                                <img
                                    src={cedula}
                                    alt="id-card"
                                    className="id-card"
                                />
                                <div className="background" />
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center justify-center`}>
                        <div className="grid grid-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-10">
                            <div ref={elemRefEs}>
                                <div
                                    className={`flex flex-col items-center transition duration-500 ${
                                        refEsIsIntersecting && !loading
                                            ? "opacity-100 pointer-events-auto translate-y-0"
                                            : "opacity-0 pointer-events-none translate-y-10"
                                    }`}
                                >
                                    <div
                                        className={`scale-0.5 transition ${
                                            currentLanguage === "es"
                                                ? "active-image"
                                                : ""
                                        }`}
                                    >
                                        <LanguageImage
                                            level={t("native-label")}
                                            src={venezuela}
                                            alt="es"
                                            onClick={() => updateLang(LANGS.ES)}
                                        />
                                    </div>
                                    <p className="text-center">
                                        {t("spanish-skill")}
                                    </p>
                                </div>
                            </div>
                            <div ref={elemRefEn}>
                                <div
                                    className={`flex flex-col items-center transition duration-500 md:delay-300 ${
                                        refEnIsIntersecting && !loading
                                            ? "opacity-100 pointer-events-auto translate-y-0"
                                            : "opacity-0 pointer-events-none translate-y-10"
                                    }`}
                                >
                                    <div
                                        className={`scale-0.5 transition ${
                                            currentLanguage === "en"
                                                ? "active-image"
                                                : ""
                                        }`}
                                    >
                                        <LanguageImage
                                            level="B1"
                                            src={usa}
                                            alt="usa"
                                            onClick={() => updateLang(LANGS.EN)}
                                        />
                                    </div>
                                    <p className="text-center">
                                        {t("english-skill")}
                                    </p>
                                </div>
                            </div>
                            <div ref={elemRefPt}>
                                <div
                                    className={`flex flex-col items-center transition duration-500 md:duration-300 md:delay-500 ${
                                        refPtIsIntersecting && !loading
                                            ? "opacity-100 pointer-events-auto translate-y-0"
                                            : "opacity-0 pointer-events-none translate-y-10"
                                    }`}
                                >
                                    <div
                                        className={`scale-0.5 transition ${
                                            currentLanguage === "pt"
                                                ? "active-image"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className="flex size-32 relative mb-5 dark:hover:drop-shadow-[0_10px_10px_rgba(22,205,229,0.8)] hover:drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] transition cursor-pointer"
                                            onClick={() => updateLang(LANGS.PT)}
                                        >
                                            <span className="absolute right-2 top-2 inline-flex items-center rounded-full bg-sky-400 px-2 py-1 text-xs font-bold dark:text-gray-900 text-white">
                                                B1
                                            </span>
                                            <div className="flex justify-center items-center p-5 rounded-full w-96 h-100 border-4 border-sky-400">
                                                <img
                                                    src={portugal}
                                                    alt="portugal"
                                                    width={"80px"}
                                                    className={`absolute transition ${
                                                        showPtPhoto
                                                            ? "opacity-0 translate-x-10"
                                                            : "translate-x-0"
                                                    }`}
                                                />
                                                <img
                                                    src={brazil}
                                                    alt="brazil"
                                                    width={"80px"}
                                                    className={`absolute transition ${
                                                        !showPtPhoto
                                                            ? "opacity-0 -translate-x-10"
                                                            : "-translate-x-0"
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center">
                                        {t("portuguese-skill")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`h-[400px] flex items-center`}>
                        <div
                            ref={educationRef}
                            className={`transition diration-500 md:px-10 ${
                                educationIsIntersecting && !loading
                                    ? "opacity-100 pointer-events-auto translate-x-0"
                                    : "opacity-0 pointer-events-none translate-x-10"
                            }`}
                        >
                            <div className="mb-10">
                                <h2 className="text-4xl mb-4">
                                    {t("views.about.titles.education")}
                                </h2>
                                <div className="text-left mb-6">
                                    <strong>
                                        {t(
                                            "views.about.studies.university.name"
                                        )}
                                    </strong>
                                    <br />
                                    {t(
                                        "views.about.studies.university.title-obtained-label"
                                    ) + ": "}
                                    {t(
                                        "views.about.studies.university.degree",
                                        {
                                            year: 2018,
                                        }
                                    )}
                                    <br />
                                    {t(
                                        "views.about.studies.university.address"
                                    )}
                                </div>
                                <div className="text-left">
                                    <strong>
                                        {t(
                                            "views.about.studies.english-certificate.name",
                                            { year: 2023 }
                                        )}
                                    </strong>
                                    <br />
                                    {t(
                                        "views.about.studies.english-certificate.institute"
                                    )}

                                    <br />
                                    {t(
                                        "views.about.studies.english-certificate.address"
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`col-span-1 lg:col-span-2`}>
                        <div
                            className="col-span-2 h-min-screen relative"
                            ref={skillsRef}
                        >
                            <div
                                className={`button-skills absolute top-1.5 -right-4 md:end-2 transition duration-300 lg:hidden cursor-pointer z-10 rounded-full p-1 ${
                                    skillsIsIntersecting && !loading
                                        ? "opacity-100 pointer-events-auto"
                                        : "opacity-0 pointer-events-none"
                                }`}
                                onClick={() => handleMenuSkills()}
                            >
                                <BsThreeDotsVertical size={25} />
                            </div>
                            <h2
                                className={`text-4xl mb-4 transition duration-500 ${
                                    skillsIsIntersecting && !loading
                                        ? "opacity-100 pointer-events-auto translate-y-0"
                                        : "opacity-0 pointer-events-none -translate-y-10"
                                }`}
                            >
                                {t("views.about.titles.skills")}
                            </h2>
                            <div className="flex gap-4 h-full">
                                <div className="h-full w-[350px] relative hidden lg:block">
                                    <ul className="space-y-2 font-medium">
                                        {categories?.map(({ name, id }) => (
                                            <li
                                                key={id}
                                                onClick={() =>
                                                    handleChangeCategorySkills(
                                                        id
                                                    )
                                                }
                                                className={`transition duration-500 ${
                                                    skillsIsIntersecting &&
                                                    !loading
                                                        ? "opacity-100 pointer-events-auto translate-x-0"
                                                        : "opacity-0 pointer-events-none -translate-x-10"
                                                }`}
                                            >
                                                <div
                                                    className={`flex gap-4 transition items-center p-2 text-gray-900 rounded-lg lg:dark:text-white group ${
                                                        id === selectedCat
                                                            ? "bg-gray-300 dark:bg-gray-500 cursor-default dark:text-white"
                                                            : "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    }`}
                                                >
                                                    <div className="w-full text-left">
                                                        {t(
                                                            `views.about.skillCategories.${name}`
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                                            {
                                                                skills.filter(
                                                                    (value) =>
                                                                        value.category_id ===
                                                                        id
                                                                ).length
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-full py-20">
                                    <div className="w-full flex flex-wrap gap-5 justify-center items-center">
                                        {skills
                                            .filter(
                                                (v) =>
                                                    v.category_id ===
                                                    selectedCat
                                            )
                                            .map((values, key) => (
                                                <a
                                                    key={key}
                                                    href={values.link}
                                                    target="_blank"
                                                >
                                                    <div
                                                        style={{
                                                            animationDelay:
                                                                !changingSkills
                                                                    ? `${
                                                                          key *
                                                                          0.05
                                                                      }s`
                                                                    : "0s",
                                                        }}
                                                        className={`w-[120px] h-[120px] p-4 flex justify-center items-center bg-gray-300 rounded-full dark:drop-shadow-[15px_15px_10px_rgba(0,0,0,0.6)] drop-shadow-[15px_15px_10px_rgba(0,0,0,0.3)] transition duration-300 hover:scale-110 ${
                                                            skillsIsIntersecting &&
                                                            !loading &&
                                                            !changingSkills
                                                                ? "arriving-skill"
                                                                : "leaving-skill"
                                                        } `}
                                                    >
                                                        <div className="dark:drop-shadow-[15px_15px_6px_rgba(0,0,0,0.5)] drop-shadow-[15px_15px_6px_rgba(0,0,0,0.2)]">
                                                            <img
                                                                src={`images/knowledge/${values.img}`}
                                                                alt={values.img}
                                                            />
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`fixed top-0 h-screen w-screen flex z-10 transition duration-300 lg:hidden ${
                    showCategories
                        ? "opacity-100 pointer-events-auto translate-x-0"
                        : "opacity-0 pointer-events-none -translate-x-96"
                }`}
            >
                <div className="w-[500px] bg-white py-5 h-full overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {categories?.map(({ name, id }) => (
                            <li
                                key={id}
                                onClick={() => handleChangeCategorySkills(id)}
                                className="transition duration-500"
                            >
                                <div
                                    className={`flex gap-4 transition items-center p-2 text-gray-900 px-5 lg:dark:text-white group ${
                                        id === selectedCat
                                            ? "bg-gray-300 dark:bg-gray-500 cursor-default dark:text-white"
                                            : "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <div className="w-full text-left">
                                        {t(
                                            `views.about.skillCategories.${name}`
                                        )}
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                            {
                                                skills.filter(
                                                    (value) =>
                                                        value.category_id === id
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    className="bg-black w-full opacity-50"
                    onClick={() => handleMenuSkills()}
                />
            </div>
        </>
    );
}
