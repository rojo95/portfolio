import { ReactNode } from "react";

const ConditionalLink = ({
    href,
    children,
}: {
    href?: string;
    children: ReactNode;
}) => {
    if (href)
        return (
            <a target="_blank" href={href}>
                {children}
            </a>
        );
    else return <>{children}</>;
};
export default ConditionalLink;
