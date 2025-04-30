import "./SpeechBooble.css";

type SideKeys = "top" | "bottom" | "left" | "right" | "";

export default function SpeechBooble({
    text,
    side = "",
}: {
    text: string;
    side?: SideKeys;
}) {
    return <div className={`bubble ${side}`}>{text}</div>;
}
