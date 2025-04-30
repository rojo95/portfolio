import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Languagedetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: {
            loading: "Loading",
            hi: "Hi!",
            "native-label": "Native",
            "hello-i-am":
                "Hi! I'm a software engineer with more than {{years}} years specializing in creating (and occasionally designing) exceptional digital experiences.",
            "about-me":
                "I'm a web developer full stack, passionate about technology and constant learning. I love to create modern and functionals solutions, explore new tools and face challenges that allow me to grow as a professional. For me, programming is a way to bring ideas to life.",
            "describing-myself":
                "I  consider myself a responsible, organized, proactive, communicative, creative and investigative person, always ready to learn new knowledge and to take on challenges of any kind. I am passionate about technology and innovation, and I am always looking to keep up to date with the latest trends in the IT field. My work experience has been in different projects that have allowed me to develop skills in various areas of software development, from analysis and design to implementation and maintenance. I am sure that my professional profile can be a great contribution to any project where a technological and creative approach is required.",
            "language-skills": "Language skills",
            "spanish-skill": "Spanish: Native",
            "english-skill": "English: level B1 (Intermediate) ",
            "portuguese-skill": "Portuguese: level B1 (Intermediate)",
            links: {
                home: "Home",
                projects: "Projects",
                workExperience: "Work Experience",
                about: "About Me",
                contact: "Contact Me",
            },
            languages: {
                spanish: "Spanish",
                english: "English",
                portuguese: "Portuguese",
            },
            views: {
                project: {
                    "tech-stack": "Technical Stack",
                },
                workExperience: {
                    validUntil: "Valid until",
                    valid: "Valid",
                    duties: "Duties of the position",
                    positions: {
                        webDevFullStack: "Web Developer Full Stack",
                        devFullStack: "Developer Full Stack",
                        seniorSysAnalyst:
                            "Integral Senior Information Systems Analyst",
                        deputySysDirector:
                            "Deputy Manager in charge of Systems Development",
                        divisionSysChief:
                            "Head of Division Systems Development Manager",
                    },
                },
                about: {
                    titles: {
                        about: "About Me",
                        education: "Education",
                        skills: "Skills",
                    },
                    studies: {
                        university: {
                            name: 'University Institute of Technology of the West "Mariscal Sucre" (IUTOMS) - by its Spanish acronym',
                            "title-obtained-label": "Title Obtained",
                            degree: "Computer Engineering, {{year}}",
                            address: "Caracas, Capital District, Venezuela.",
                        },
                        "english-certificate": {
                            name: "English Certificate - {{year}}",
                            institute:
                                'Language Center "Rosa Luxemburgo", Bolivarian University of Venezuela (UBV) - by its Spanish acronym.',
                            address: "Caracas, Capital District, Venezuela.",
                        },
                    },
                    skillCategories: {
                        langs: "Programming Languages",
                        langWebD: "Web Design Tools",
                        frameworks: "Frameworks",
                        entornoEjecucion: "Execution Environments",
                        sO: "Operating Systems",
                        servidores: "Servers",
                        virtualizacion: "Virtualizers",
                        libs: "Libraries",
                        cms: "Content Management Systems (CMS)",
                        ddbb: "Databases",
                        version: "Version Control",
                    },
                },
            },
        },
    },
    es: {
        translation: {
            loading: "Cargando",
            hi: "¡Hola!",
            "native-label": "Nativo",
            "hello-i-am":
                "¡Hola! Soy un ingeniero en informática con más de {{years}} años especializado en la creación (y ocasionalmente el diseño) de experiencias digitales excepcionales.",
            "about-me":
                "Soy desarrollador web full stack, apasionado por la tecnología y el aprendizaje constante. Disfruto crear soluciones modernas y funcionales, explorando nuevas herramientas y enfrentando desafíos que me permitan crecer. Para mí, programar es una forma de dar vida a las ideas.",
            "describing-myself":
                "Me considero una persona responsable, organizada, proactiva, comunicativa, creativa e investigativa, siempre dispuesta a aprender nuevos conocimientos y a asumir retos de cualquier tipo. Me apasiona la tecnología y la innovación, y siempre busco estar al día con las últimas tendencias en el campo de la informática. Mi experiencia laboral ha sido en distintos proyectos que me han permitido desarrollar habilidades en diversas áreas del desarrollo de software, desde el análisis y diseño hasta la implementación y mantenimiento. Estoy seguro de que mi perfil profesional puede ser un gran aporte para cualquier proyecto en el que se requiera un enfoque tecnológico y creativo.",
            "language-skills": "Habilidades lingüísticas",
            "spanish-skill": "Español: Nativo",
            "english-skill": "Inglés: nivel B1 (Intermedio)",
            "portuguese-skill": "Portugués: nivel B1 (Intermedio)",
            links: {
                home: "Inicio",
                projects: "Proyectos",
                workExperience: "Experiencia Laboral",
                about: "Acerca de Mí",
                contact: "Contacta Me",
            },
            languages: {
                spanish: "Español",
                english: "Inglés",
                portuguese: "Portugués",
            },
            views: {
                project: {
                    "tech-stack": "Stack Tecnológico",
                },
                workExperience: {
                    validUntil: "Válido hasta",
                    valid: "Válido",
                    duties: "Funciones del cargo",
                    positions: {
                        webDevFullStack: "Desarrollador Web Full Stack",
                        devFullStack: "Desarrollador Full Stack",
                        seniorSysAnalyst:
                            "Analista Integral Senior de Sistemas Informáticos",
                        deputySysDirector:
                            "Sub Gerente Encargado de Desarrollo de Sistemas",
                        divisionSysChief:
                            "Jefe de División de Desarrollo de Sistemas",
                    },
                },
                about: {
                    titles: {
                        about: "Acerca de Mí",
                        education: "Educación",
                        skills: "Habilidades",
                    },
                    studies: {
                        university: {
                            name: 'Instituto Universitario de Tecnología del Oeste "Mariscal Sucre" (IUTOMS)',
                            "title-obtained-label": "Título Obtenido",
                            degree: "Ingeniería en Informática, {{year}}",
                            address: "Caracas, Distrito Capital, Venezuela.",
                        },
                        "english-certificate": {
                            name: "Certificado de Inglés - {{year}}",
                            institute:
                                'Centro de Idiomas "Rosa Luxemburgo", de la Universidad Bolivariana de Venezuela (UBV).',
                            address: "Caracas, Distrito Capital, Venezuela.",
                        },
                    },
                    skillCategories: {
                        langs: "Lenguajes de Programación",
                        langWebD: "Herramientas de Diseño Web",
                        frameworks: "Frameworks",
                        entornoEjecucion: "Entornos de Ejecución",
                        sO: "Sistemas Operativos",
                        servidores: "Servidores",
                        virtualizacion: "Virtualizadores",
                        libs: "Librerías",
                        cms: "Sistemas de Gestión de Contenido (CMS)",
                        ddbb: "Bases de Datos",
                        version: "Control de Versiones",
                    },
                },
            },
        },
    },
    pt: {
        translation: {
            loading: "A carregar",
            hi: "Oi!",
            "native-label": "Nativo",
            "hello-i-am":
                "Oi! Sou um engenheiro de software com mais de {{years}} anos de especialização na creação (e, ocasionalmente, no design) de experiências digitais excepcionais.",
            "about-me":
                "Sou um desenvolvedor web full stack, apaixonado por tecnologias e o constante aprendizagem. Gosto de criar soluções modernas e funcionais, explorar novas ferramentas e enfrentar desafios que me permitam crescer como profissional. Para mim a programação é uma forma de dar vida às ideias.",
            "describing-myself":
                "Considero-me uma pessoa responsável, organizada, proactiva, comunicativa, criativa e investigativa, sempre pronta a aprender novos conhecimentos e a aceitar desafios de qualquer tipo. Sou apaixonado por tecnologia e inovação, e procuro estar sempre a par das últimas tendências na área das TI. A minha experiência de trabalho tem sido em diferentes projectos que me permitiram desenvolver competências em diferentes áreas do desenvolvimento de software, desde a análise e conceção até à implementação e manutenção. Estou certo de que o meu perfil profissional pode ser um grande contributo para qualquer projeto em que seja necessária uma abordagem tecnológica e criativa.",
            "language-skills": "Competências linguísticas",
            "spanish-skill": "Espanhol: Nativo",
            "english-skill": "Inglês: nível B1 (Intermedio)",
            "portuguese-skill": "Português: nível B1 (Intermedio)",
            links: {
                home: "Início",
                projects: "Projectos",
                workExperience: "Experiência Profissional",
                about: "Sobre Mim",
                contact: "Contacte-me",
            },
            languages: {
                spanish: "Espanhol",
                english: "Inglês",
                portuguese: "Português",
            },
            views: {
                project: {
                    "tech-stack": "Stack Tecnológico",
                },
                workExperience: {
                    validUntil: "Válido até",
                    valid: "Válido",
                    duties: "Funções do cargo",
                    positions: {
                        webDevFullStack: "Desenvolvedor Web Full Stack",
                        devFullStack: "Desenvolvedor Full Stack",
                        seniorSysAnalyst:
                            "Analista Sénior de Sistemas Integrados de TI",
                        deputySysDirector:
                            "Diretor-adjunto de Desenvolvimento de Sistemas",
                        divisionSysChief:
                            "Chefe de Divisão de Desenvolvimento de Sistemas",
                    },
                },
                about: {
                    titles: {
                        about: "Sobre Mím",
                        education: "Educaçâo",
                        skills: "Habilidades",
                    },
                    studies: {
                        university: {
                            name: 'Instituto Universitário de Tecnologia do Oeste "Mariscal Sucre" (IUTOMS)',
                            "title-obtained-label": "Título obtido",
                            degree: "Engenharia informática, {{year}}",
                            address: "Caracas, Distrito Capital, Venezuela.",
                        },
                        "english-certificate": {
                            name: "Certificado de Inglês - {{year}}",
                            institute:
                                'Centro de Línguas "Rosa Luxemburgo", Universidade Bolivariana da Venezuela (UBV)',
                            address: "Caracas, Distrito Capital, Venezuela.",
                        },
                    },
                    skillCategories: {
                        langs: "Linguagens de Programação",
                        langWebD: "Ferramentas de Web Design",
                        frameworks: "Frameworks",
                        entornoEjecucion: "Ambientes de Execução",
                        sO: "Sistemas Operativos",
                        servidores: "Servidores",
                        virtualizacion: "Virtualizadores",
                        libs: "Livrarias",
                        cms: "Sistemas de Gestão de Conteúdos (CMS)",
                        ddbb: "Bases de Dados",
                        version: "Control de Versões",
                    },
                },
            },
        },
    },
};

i18next
    .use(initReactI18next)
    .use(Languagedetector)
    .init({
        debug: true,
        fallbackLng: "es",
        interpolation: {
            escapeValue: false,
        },
        resources,
    });

export default i18next;
