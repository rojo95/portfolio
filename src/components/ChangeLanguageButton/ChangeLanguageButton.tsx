import { useState } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import veFlag from "@assets/images/ve_flag.webp";
import usFlag from "@assets/images/usa_flag.webp";
import brPtFlag from "@assets/images/br_pt_flag.webp";
import { useLoading } from "@hooks/useLoading/useLoading";
import { BsGlobeAmericas } from "react-icons/bs";

export default function ChangeLanguageButton() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { startLoading, stopLoading } = useLoading();
    const [showLanguages, setShowLanguages] = useState<boolean>(false);

    function changeLangFunction(lang: string) {
        if (lang === currentLanguage) return;

        startLoading();
        setShowLanguages(false);
        setTimeout(() => {
            changeLanguage(lang);
            stopLoading();
        }, 700);
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowLanguages(!showLanguages)}
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
                <BsGlobeAmericas className="size-6" />
            </button>

            <div
                className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden transition ${
                    showLanguages
                        ? "opacity-100 pointer-events-auto cursor-pointer"
                        : "opacity-0 pointer-events-none"
                }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                // tabindex="-1"
            >
                <div
                    onClick={() => changeLangFunction("es")}
                    className={`block px-4 py-2 text-sm text-gray-700 flex justify-between ${
                        currentLanguage === "es"
                            ? "bg-gray-200 font-semibold"
                            : ""
                    }`}
                    role="menuitem"
                    // tabindex="-1"
                    id="user-menu-item-0"
                >
                    <div>
                        <img src={veFlag} alt="veFlag" width={20} />
                    </div>
                    <div>{t("languages.spanish")}</div>
                </div>
                <div
                    onClick={() => changeLangFunction("en")}
                    className={`block px-4 py-2 text-sm text-gray-700 flex justify-between ${
                        currentLanguage === "en"
                            ? "bg-gray-200 font-semibold"
                            : ""
                    }`}
                    role="menuitem"
                    // tabindex="-1"
                    id="user-menu-item-1"
                >
                    <div>
                        <img src={usFlag} alt="usFlag" width={20} />
                    </div>
                    <div>{t("languages.english")}</div>
                </div>
                <div
                    onClick={() => changeLangFunction("pt")}
                    className={`block px-4 py-2 text-sm text-gray-700 flex justify-between ${
                        currentLanguage === "pt"
                            ? "bg-gray-200 font-semibold"
                            : ""
                    }`}
                    role="menuitem"
                    // tabindex="-1"
                    id="user-menu-item-2"
                >
                    <div>
                        <img src={brPtFlag} alt="brPtFlag" width={20} />
                    </div>
                    <div>{t("languages.portuguese")}</div>
                </div>
            </div>
        </div>
    );
}
