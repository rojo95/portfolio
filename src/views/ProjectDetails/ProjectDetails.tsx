import { fetchProjectById, Project } from "@api/projects";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCode } from "react-icons/fa";
import { TfiClose } from "react-icons/tfi";
import ConditionalLink from "@components/ConditionalLink/ConditionalLink";

export interface ProjectDetailsProps {
    params: {
        id: string;
    };
}

interface Position {
    x: number;
    y: number;
}

const urlBase = import.meta.env.BASE_URL;

export default function ProductDetails({ params }: ProjectDetailsProps) {
    const { t } = useTranslation();
    const [data, setData] = useState<Project | undefined>(undefined);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [zoomImage, setZoomImage] = useState<boolean>(false);
    const [imagePosition, setImagePosition] = useState<Position>({
        x: 0,
        y: 0,
    });
    const [autoPlay, setAutoPlay] = useState<boolean>(true);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const sliderRef = useRef<Slider>(null);

    const imageRef = useRef<HTMLImageElement | null>(null);

    const settings: Settings = {
        dots: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    function handleAutoPlaySlider(state: boolean) {
        {
            if (autoPlay) {
                sliderRef.current?.slickPause();
            } else {
                sliderRef.current?.slickPlay();
            }
            setAutoPlay(state);
        }
    }

    async function getProjectById() {
        const project = await fetchProjectById(parseInt(params.id));
        if (!project) return;

        setData(project);
    }

    function showFullScreenImage(src: string | null) {
        setFullscreenImage(src);
        if (!src) {
            setZoomImage(false);
            setImagePosition({
                x: 0,
                y: 0,
            });
        }
        handleAutoPlaySlider(!src ? true : false);
    }

    function handleZoomImage(state: boolean) {
        if (!state) {
            setImagePosition({
                x: 0,
                y: 0,
            });
        }
        setZoomImage(state);
    }

    useEffect(() => {
        getProjectById();
    }, [params.id]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (zoomImage && fullscreenImage && imageRef.current) {
            const { clientY } = e;
            const windowHeight = window.innerHeight;
            const imageHeight = imageRef.current.offsetHeight;

            const mouseRatioY = clientY / windowHeight;

            // Calcular el rango máximo de movimiento permitido
            const maxTranslateY = Math.max(0, (imageHeight - windowHeight) / 2);

            // El movimiento será proporcional al mouse
            const translateY = -(mouseRatioY - 0.5) * 2 * maxTranslateY;

            setImagePosition({
                x: 0,
                y: translateY,
            });
        }
    };

    const handleImageMouseDown = () => {
        setIsDragging(false);
    };

    const handleImageMouseMove = () => {
        setIsDragging(true);
    };

    const handleImageClick = (img: string) => {
        if (!isDragging) {
            showFullScreenImage(img);
        }
    };

    return (
        <div className="md:px-40">
            <div className="max-w-9/10 mx-auto p-6 bg-white shadow-lg rounded-lg h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="col-span-2 my-4 px-3">
                        {data?.gallery?.length === 1 ? ( // Verifica si hay un solo elemento
                            <div className="border rounded-lg border-gray-400 cursor-pointer">
                                <img
                                    src={`${urlBase}images/projects/${data.gallery[0].img}`}
                                    alt={data.gallery[0].img}
                                    className="w-full h-96 object-cover rounded-lg"
                                    onClick={() =>
                                        showFullScreenImage(
                                            data.gallery![0].img
                                        )
                                    }
                                />
                            </div>
                        ) : (
                            <Slider ref={sliderRef} {...settings}>
                                {data?.gallery?.map(({ img }, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg border-gray-400 cursor-pointer"
                                    >
                                        <img
                                            src={`${urlBase}images/projects/${img}`}
                                            alt={img}
                                            className="w-full h-96 object-cover rounded-lg"
                                            onMouseDown={handleImageMouseDown}
                                            onMouseMove={handleImageMouseMove}
                                            onClick={() =>
                                                handleImageClick(img)
                                            }
                                        />
                                    </div>
                                ))}
                            </Slider>
                        )}
                    </div>
                    <div className="my-4 grid gap-4 w-full">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">
                            {data?.title}
                        </h1>
                        <div className="flex flex-wrap gap-1">
                            {data?.type.map((value, key) => (
                                <div
                                    key={key}
                                    className="text-xs text-white bg-cyan-600 px-2 py-1 rounded-full h-6"
                                >
                                    {value}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-gray-600 mt-2 text-left">
                                {data?.description}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                {t("views.project.tech-stack")}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {data?.tech.map(
                                    ({ name, image, docs, hidden }, key) =>
                                        !hidden ? (
                                            <div
                                                key={key}
                                                className="size-7 flex place-items-center"
                                            >
                                                <ConditionalLink href={docs}>
                                                    {image ? (
                                                        <img
                                                            title={name}
                                                            src={`${urlBase}images/knowledge/${image}`}
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
                        </div>
                        {data?.demo && (
                            <a
                                href={data.demo}
                                target="_blank"
                                className="block mt-4 px-6 py-2 bg-green-600 hover:bg-white border-2 border-green-600 transition text-white hover:text-green-600 rounded-md font-seminormal"
                            >
                                Demo
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={`fixed transition duration-400 inset-0 flex justify-center items-center z-50 ${
                    fullscreenImage
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onMouseMove={handleMouseMove}
            >
                <div
                    className="absolute w-screen h-screen bg-black bg-opacity-40 backdrop-blur-sm z-10 cursor-pointer transition-all duration-500"
                    onClick={() => showFullScreenImage(null)}
                />
                <img
                    ref={imageRef}
                    src={`${urlBase}images/projects/${fullscreenImage}`}
                    alt="Fullscreen"
                    onLoad={() => setIsLoading(false)}
                    className={`max-w-full z-20 transition-transform transition-opacity ease-in-out ${
                        zoomImage
                            ? "cursor-zoom-out w-auto h-auto"
                            : "cursor-zoom-in max-h-full"
                    } ${isLoading ? "blur" : ""}`}
                    onClick={() => handleZoomImage(!zoomImage)}
                    style={{
                        transform: `translate(${imagePosition.x}px, ${
                            imagePosition.y
                        }px) scale(${fullscreenImage ? 1 : 0.8})`,
                        opacity: fullscreenImage ? 1 : 0,
                    }}
                />

                {isLoading && (
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-30">
                        <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
                    </div>
                )}

                <div
                    className="rounded-full bg-white absolute transition top-5 right-5 z-20 hover:text-cyan-500 text-gray-700 size-8 cursor-pointer grid place-items-center shadow-lg shadow-gray-400"
                    onClick={() => showFullScreenImage(null)}
                >
                    <TfiClose className="size-5" />
                </div>
            </div>
        </div>
    );
}
