export default function LanguageImage({
    level,
    src,
    alt,
    onClick,
}: {
    level: string;
    src: string;
    alt: string;
    onClick: () => void;
}) {
    return (
        <div
            className="flex size-32 relative mb-5 dark:hover:drop-shadow-[0_10px_10px_rgba(22,205,229,0.8)] hover:drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] transition cursor-pointer"
            onClick={onClick}
        >
            <span className="absolute right-2 top-2 inline-flex items-center rounded-full bg-sky-400 px-2 py-1 text-xs font-bold dark:text-gray-900 text-white">
                {level}
            </span>
            <div className="flex justify-center items-center p-5 rounded-full w-96 h-100 border-4 border-sky-400">
                <img src={src} alt={alt} width={100} />
            </div>
        </div>
    );
}
