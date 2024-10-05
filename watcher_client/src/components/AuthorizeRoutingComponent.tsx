import React, { ReactNode, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const AuthorizeRoutingComponent: React.FC<{ children: ReactNode }> = ({children}) => {
    const [cookies] = useCookies(["user"]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.user) {
            navigate("/login");
        }
    }, [cookies, navigate]);

    return (
        <>
            {children}
        </>
    )
}

export default AuthorizeRoutingComponent;