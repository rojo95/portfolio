import { Link, Redirect, Route, Switch, useLocation } from "wouter";
import "./App.css";
import Home from "./views/Home/Home";
import "./i18n";
import WorkExperience from "./views/WorkExperience/WorkExperience";
import { useTranslation } from "react-i18next";
import About from "./views/About/About";
import me from "@assets/images/johan_pixelart.webp";
import ChangeLanguageButton from "@components/ChangeLanguageButton/ChangeLanguageButton";
import { useLoading } from "@hooks/useLoading/useLoading";
import Projects from "./views/Projects/Projects";
import ProjectDetails from "./views/ProjectDetails/ProjectDetails";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { IoIosBusiness, IoMdDesktop, IoMdHome } from "react-icons/io";
import { FaGithub, FaUserTie } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const urlBase = import.meta.env.BASE_URL;

const routes = [
    {
        name: "home",
        link: "",
        component: Home,
        hidde: false,
        icon: <IoMdHome />,
    },
    {
        name: "projects",
        link: "projects",
        component: Projects,
        hidde: false,
        icon: <IoMdDesktop />,
    },
    {
        name: "project-detail",
        link: "projects/:id",
        component: ProjectDetails,
        hidde: true,
        icon: <IoIosBusiness />,
    },
    {
        name: "workExperience",
        link: "work-experience",
        component: WorkExperience,
        hidde: false,
        icon: <IoIosBusiness />,
    },
    {
        name: "about",
        link: "about",
        component: About,
        hidde: false,
        icon: <FaUserTie />,
    },
] as const;

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    displayed?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, displayed }) => {
    const { loading } = useLoading();
    const [location] = useLocation();

    // Asegura que la comparación sea correcta
    const isActive = location === href;

    return (
        <Link
            href={href}
            className={`block sm:inline rounded-none sm:rounded-md px-3 py-2 text-base sm:text-sm font-medium transition ${
                isActive
                    ? "border-cyan-300 border-b-2 sm:border-0 bg-gray-800 sm:bg-gray-900 text-cyan-300 hover:text-cyan-300 cursor-default"
                    : "text-gray-700 sm:text-gray-300 hover:bg-gray-200 sm:hover:bg-gray-700 hover:text-gray-700 sm:hover:text-white"
            } ${
                !loading
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
            } ${
                !displayed || loading
                    ? "pointer-events-none sm:pointer-events-auto"
                    : ""
            }`}
        >
            {children}
        </Link>
    );
};

function App() {
    const { t } = useTranslation();
    const { loading } = useLoading();
    const [showMenu, setShowMenu] = useState<boolean>(false);

    return (
        <div className="content">
            <div>
                <header>
                    <nav className="bg-gray-800">
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <button
                                        type="button"
                                        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white focus:outline-hidden "
                                        aria-controls="mobile-menu"
                                        aria-expanded="false"
                                        onClick={() => setShowMenu(!showMenu)}
                                    >
                                        <span className="absolute -inset-0.5"></span>
                                        <span className="sr-only">
                                            Abrir Menú Principal
                                        </span>
                                        <IoMenu />
                                    </button>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex shrink-0 items-center">
                                        <img
                                            className="size-8 rounded-full"
                                            src={me}
                                            alt="yo"
                                        />
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {routes.map(
                                                ({ name, link, hidde }, key) =>
                                                    !hidde && (
                                                        <NavLink
                                                            key={key}
                                                            href={
                                                                urlBase + link
                                                            }
                                                        >
                                                            {t(`links.${name}`)}
                                                        </NavLink>
                                                    )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <ChangeLanguageButton />
                                </div>
                            </div>
                        </div>

                        <div
                            className={`sm:hidden fixed top-0 left-0 h-screen w-screen z-10 transition duration-500 ${
                                showMenu
                                    ? "pointer-events-auto translate-x-0 opacity-100"
                                    : "pointer-events-none translate-x-[50%] opacity-0"
                            }`}
                            id="mobile-menu"
                        >
                            <div
                                className="bg-gray-900 opacity-40 w-full h-screen"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute top-0 right-0 space-y-1 px-2 pt-2 pb-3 bg-white h-full w-200">
                                {routes.map(
                                    ({ name, link, hidde, icon }, key) =>
                                        !hidde && (
                                            <div
                                                onClick={() =>
                                                    setShowMenu(false)
                                                }
                                            >
                                                <NavLink
                                                    key={key}
                                                    href={urlBase + link}
                                                    displayed={showMenu}
                                                >
                                                    <div className="flex items-center justify-between ">
                                                        <div className="mr-5">
                                                            {icon}
                                                        </div>
                                                        <div className="">
                                                            {t(`links.${name}`)}
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    </nav>
                </header>
            </div>

            <div className="px-0 flex justify-center">
                <main className="mx-0 p-1 md:p-4 pb-10 flex-grow h-full">
                    <Switch>
                        {routes.map(({ component, link }, key) => (
                            <Route
                                key={key}
                                path={urlBase + link}
                                component={component}
                            />
                        ))}
                        <Route>
                            <Redirect to={urlBase} />
                        </Route>
                    </Switch>
                </main>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800">
                <footer className="py-8 px-0 sm:px-2 md:px-20">
                    <div className="w-full flex flex-wrap gap-2 justify-center lg:justify-end">
                        <div>
                            <a
                                className="flex items-center gap-2 text-black dark:text-white transition hover:text-[#F7D117] drop-shadow-lg dark:hover:drop-shadow-cyan-300 dark:hover:drop-shadow-cyan-500/50"
                                href="mailto:r.johan95@gmail.com"
                            >
                                <SiGmail size={25} />
                            </a>
                        </div>
                        <div>
                            <a
                                className="flex items-center gap-2 text-black dark:text-white transition hover:text-[#0e76a8] drop-shadow-lg dark:hover:drop-shadow-cyan-300 dark:hover:drop-shadow-cyan-500/50"
                                href="http://linkedin.com/in/johan-román-510b21162/"
                                target="_blank"
                            >
                                <FaLinkedin size={25} />
                            </a>
                        </div>
                        <div>
                            <a
                                className="flex items-center gap-2 text-black dark:text-white transition hover:text-[#CF142B] drop-shadow-lg dark:hover:drop-shadow-cyan-300 dark:hover:drop-shadow-cyan-500/50"
                                href="http://https://github.com/rojo95/"
                                target="_blank"
                            >
                                <FaGithub size={25} />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div
                            className={`text-sm text-gray-500 sm:text-center dark:text-gray-400 flex justify-start items-center transition h-full ${
                                !loading
                                    ? "opacity-100 pointer-events-auto translate-x-0"
                                    : "opacity-0 pointer-events-none -translate-x-full"
                            }`}
                        >
                            <span>
                                © 2025{" "}
                                <Link
                                    href={"/"}
                                    className="hover:underline text-black hover:text-black dark:text-cyan-300 dark:hover:text-cyan-300"
                                >
                                    Johan Román
                                </Link>
                                . All Rights Reserved.
                            </span>
                        </div>
                        <div className="flex justify-center lg:justify-end items-center py-3">
                            <ul
                                className={`block md:flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0 transition ${
                                    !loading
                                        ? "opacity-100 pointer-events-auto translate-x-0"
                                        : "opacity-0 pointer-events-none translate-x-full"
                                }`}
                            >
                                {routes.map(
                                    ({ name, link, hidde = false }, key) =>
                                        !hidde && (
                                            <li key={key}>
                                                <Link
                                                    href={urlBase + link}
                                                    className="hover:underline me-4 md:me-6 dark:text-cyan-300 dark:hover:text-cyan-300 text-black hover:text-black"
                                                >
                                                    {t(`links.${name}`)}
                                                </Link>
                                            </li>
                                        )
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <span
                            className={`text-sm text-gray-500 sm:text-center dark:text-gray-400 transition ${
                                !loading
                                    ? "opacity-100 pointer-events-auto translate-x-0"
                                    : "opacity-0 pointer-events-none -translate-x-full"
                            }`}
                        >
                            © 2025{" "}
                            <Link
                                href={"/"}
                                className="hover:underline text-black hover:text-black dark:text-cyan-300 dark:hover:text-cyan-300"
                            >
                                Johan Román
                            </Link>
                            . All Rights Reserved.
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;
