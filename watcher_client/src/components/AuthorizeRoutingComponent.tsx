import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthorizeRoutingComponent: React.FC<{ children: ReactNode }> = ({children}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user || !user.token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            {children}
        </>
    )
}

export default AuthorizeRoutingComponent;