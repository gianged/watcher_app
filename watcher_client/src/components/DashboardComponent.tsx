import React, { useEffect } from "react";

interface DashboardProps {
    role: string,
    department: string,
}

export const DashboardComponent: React.FC<DashboardProps> = ({role = 0, department = 0}) => {
    useEffect(() => {

    }, []);

    return (
        <>

        </>
    )
}