import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchWorks, Work } from "@api/works";
import "./WorkExperience.css";
import { QRCodeSVG } from "qrcode.react";
import ConditionalLink from "@components/ConditionalLink/ConditionalLink";
import { FaCode } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useLoading } from "@hooks/useLoading/useLoading";

export default function WorkExperience() {
    const { t, i18n } = useTranslation();
    const { loading } = useLoading();
    const currentLanguage = i18n.language;
    const [data, setData] = useState<Work[]>([]);
    const [selected, setSelected] = useState<Work | null>(null);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [showCarnet, setShowCarnet] = useState<boolean>(false);

    async function getWorks() {
        try {
            const work = await fetchWorks();
            if (!work) return;

            setData(work);
            setSelected(work[0]);
        } catch (error) {
            console.error(error);
        }
    }

    function handleChangeJob(value: Work) {
        setShowCarnet(true);
        if (selected === value) return;

        setIsFlipped((prev) => !prev);
        setTimeout(() => {
            setSelected(value);
            setIsFlipped(false);
        }, 300);
    }

    type DateFormat = "long" | "short" | "monthYear";
    function formatDate({
        date,
        format = "long",
    }: {
        date: Date;
        format?: DateFormat;
    }): string {
        let options: Intl.DateTimeFormatOptions;

        switch (format) {
            case "long":
                options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                break;
            case "short":
                options = {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                };
                break;
            case "monthYear":
                options = {
                    year: "numeric",
                    month: "long",
                };
                break;
            default:
                options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                break;
        }

        let formatter: Intl.DateTimeFormat;

        switch (currentLanguage) {
            case "es":
                formatter = new Intl.DateTimeFormat("es-ES", options);
                break;
            case "pt":
                formatter = new Intl.DateTimeFormat("pt-PT", options);
                break;
            case "en":
            default:
                formatter = new Intl.DateTimeFormat("en-US", options);
                break;
        }
        return formatter.format(date);
    }

    useEffect(() => {
        getWorks();
    }, []);

    useEffect(() => {
        if (!loading) return;

        setIsFlipped(true);
        setTimeout(() => {
            setIsFlipped(false);
        }, 470);
    }, [loading]);

    return (
        <>
            <title>{`Johan Román - ${t("links.workExperience")}`}</title>
            <div className="view-works md:flex px-0 lg:px-20">
                <div className="work-container">
                    <ol className="relative time-list md:pr-10">
                        {data.map((value, key) => (
                            <li
                                className={`list-item ${
                                    key % 2 === 0 ? "start" : "end"
                                }`}
                                key={key}
                            >
                                <div className="time-line" />
                                <div
                                    className={`time-conector ${
                                        key % 2 === 0
                                            ? "from-right"
                                            : "from-left"
                                    }`}
                                    style={{
                                        animationDelay: `${key * 0.2}s`,
                                    }}
                                >
                                    <div
                                        className={`time-node ${
                                            selected?.name === value.name
                                                ? "active"
                                                : ""
                                        } ${
                                            key % 2 !== 0
                                                ? "from-left"
                                                : "from-right"
                                        } `}
                                    />
                                    <div
                                        className={`connected ${
                                            selected?.name === value.name
                                                ? "active"
                                                : ""
                                        } ${key % 2 === 0 ? "right" : "left"}`}
                                    />
                                </div>
                                <div
                                    onClick={() => handleChangeJob(value)}
                                    className={`work-card rotation-in dark:bg-gray-100 hover:shadow-cyan-400 cursor-pointer ${
                                        key % 2 === 0 ? "right" : "left"
                                    }`}
                                    style={{
                                        animationDelay: `${key * 0.2}s`,
                                    }}
                                >
                                    <div
                                        className={`absolute w-3 h-3 rounded-full mt-1.5 z-10 ${
                                            key % 2 === 0
                                                ? "start-1.5"
                                                : "end-1.5 sm:start-1.5"
                                        } shadow ${
                                            !value.endDate
                                                ? "bg-green-400 dark:bg-green-500 dark:shadow-green-400 shadow-green-300"
                                                : "bg-gray-500 dark:bg-gray-700 shadow-gray-900"
                                        }`}
                                    />
                                    <div className="flex">
                                        <div
                                            className="py-5 px-3 work-info"
                                            style={{
                                                animationDelay: `${
                                                    key * 0.25
                                                }s`,
                                            }}
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 position">
                                                {t(
                                                    `views.workExperience.positions.${value.position}`
                                                )}
                                            </h3>
                                            <div className="grid grid-cols-1 gap-1 my-2">
                                                <p
                                                    className={`text-sm font-normal leading-none  ${
                                                        !value.endDate
                                                            ? "text-green-500"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {value.shortName}
                                                </p>
                                                <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                    {formatDate({
                                                        date: new Date(
                                                            value.startDate
                                                        ),
                                                        format: "monthYear",
                                                    })}
                                                    {value.endDate
                                                        ? ` - ${formatDate({
                                                              date: new Date(
                                                                  value.endDate
                                                              ),
                                                              format: "monthYear",
                                                          })}`
                                                        : undefined}
                                                </time>
                                            </div>
                                        </div>
                                        <div
                                            className={`work-image-div ${
                                                key % 2 === 0
                                                    ? ""
                                                    : "xl:order-first"
                                            }`}
                                            style={{
                                                animationDelay: `${0.1}s`,
                                            }}
                                        >
                                            <img
                                                className="card-background-logo"
                                                src={`images/works/${value.image}`}
                                                alt={value.image}
                                            />
                                            <img
                                                className="card-logo"
                                                src={`images/works/${value.logo}`}
                                                alt={value.logo}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="col-span-1">
                    {selected ? (
                        <div
                            className={`w-full flex justify-center items-center carnet-container top-0 left-0 w-full h-full transition absolute md:relative ${
                                showCarnet
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none md:pointer-events-auto md:opacity-100"
                            }`}
                        >
                            <div
                                className="carnet-background-div"
                                onClick={() => setShowCarnet(!showCarnet)}
                            />
                            <IoClose
                                onClick={() => setShowCarnet(!showCarnet)}
                                className="close-button size-8"
                            />
                            <div
                                className={`carnet cursor-pointer ${
                                    isFlipped ? "is-flipped" : ""
                                }`}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <div className="carnet-back face-content">
                                    <div className="white-circle" />
                                    <img
                                        className="watermark"
                                        src={`images/works/${selected.logo}`}
                                        alt={selected.logo}
                                    />
                                    <div className="info">
                                        <p className="name">{selected.name}</p>
                                        <p>
                                            <b>
                                                {t(
                                                    "views.workExperience.duties"
                                                ) + ": "}
                                            </b>
                                            {selected.rolesDescription}
                                        </p>
                                        <ul className="roles list-disc">
                                            {selected.roles.map(
                                                (value, key) => (
                                                    <li key={key}>{value}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div className="skills">
                                        {selected.skills.map(
                                            (
                                                { name, image, docs, hidden },
                                                key
                                            ) =>
                                                !hidden ? (
                                                    <div
                                                        key={key}
                                                        className="skill-div"
                                                    >
                                                        <ConditionalLink
                                                            href={docs}
                                                        >
                                                            {image ? (
                                                                <img
                                                                    title={name}
                                                                    src={`/images/knowledge/${image}`}
                                                                    alt={name}
                                                                    className="max-w-full max-h-full drop-shadow-lg text-gray-700 object-contain"
                                                                />
                                                            ) : (
                                                                <div
                                                                    title={name}
                                                                    className="bg-gray-300 size-full rounded-full grid place-items-center text-gray-700"
                                                                >
                                                                    <FaCode />
                                                                </div>
                                                            )}
                                                        </ConditionalLink>
                                                    </div>
                                                ) : null
                                        )}
                                    </div>
                                    <div className="qr">
                                        <QRCodeSVG
                                            size={60}
                                            value={selected?.description || ""}
                                        />
                                    </div>
                                </div>
                                <div className={`carnet-front face-content`}>
                                    <div className="secondary-top face-content" />
                                    <div className="primary-top face-content" />
                                    <div className="blue-circle face-content" />
                                    <div className="base-color face-content" />
                                    <div className="overlay face-content" />
                                    <p className="title face-content">
                                        {selected.shortName}
                                    </p>
                                    <div className="carnet-image-container absolute rounded-md overflow-hidden drop-shadow-lg face-content">
                                        <img
                                            className="carnet-image-background absolute top-0 left-0 face-content"
                                            src={`images/works/${selected.image}`}
                                        />
                                        <img
                                            className="carnet-image face-content"
                                            src={`images/works/${selected.idCard}`}
                                        />
                                    </div>
                                    <div className="absolute info px-5 face-content">
                                        <p className="text-gray-900 font-bold text-2xl face-content">
                                            Johan A. Román
                                        </p>
                                        <p className="text-gray-600 face-content">
                                            {t(
                                                `views.workExperience.positions.${selected.position}`
                                            )}
                                        </p>
                                    </div>
                                    <div className="bottom-bar face-content" />
                                    <div className="absolute logo face-content">
                                        <img
                                            src={`images/works/${selected.logo}`}
                                        />
                                    </div>
                                    <div className="absolute expiration text-white face-content">
                                        {selected.endDate ? (
                                            <p className="text-sm">
                                                {t(
                                                    "views.workExperience.validUntil"
                                                ) +
                                                    ": " +
                                                    formatDate({
                                                        date: new Date(
                                                            selected.endDate
                                                        ),
                                                        format: "monthYear",
                                                    })}
                                            </p>
                                        ) : (
                                            t("views.workExperience.valid")
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}
