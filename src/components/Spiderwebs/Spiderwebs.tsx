import { useState } from "react";
import web from "@assets/images/halloween/web_1.png";
import web2 from "@assets/images/halloween/web_2.png";
import spider from "@assets/images/halloween/spider.png";
import blood_splat from "@assets/images/halloween/blood_splat.webp";
export default function Spiderwebs() {
  const now = new Date();
  const isOctober = now.getMonth() === 9;
  const [clicked, setClicked] = useState(false);
  return isOctober ? (
    <>
      <img
        src={web2}
        alt=""
        className="fixed top-0 right-0 z-[9999] pointer-events-none brightness-50 dark:brightness-100"
      />

      <img
        src={clicked ? blood_splat : spider}
        alt=""
        className={`fixed w-20 -rotate-45 top-20 right-0 z-[9999] cursor-grab ${clicked ? "pointer-events-none" : "dark:invert"}`}
        onClick={() => setClicked(true)}
      />

      <img
        src={web}
        alt=""
        className="fixed -bottom-40 -left-40 z-[9999] pointer-events-none brightness-0 dark:invert"
      />
    </>
  ) : null;
}
