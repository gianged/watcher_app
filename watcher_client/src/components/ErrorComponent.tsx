import React from "react";

interface ErrorPageProps {
    statusCode: number;
    errorMessage?: string;
}

export const ErrorComponent: React.FC<ErrorPageProps> = ({statusCode = 500, errorMessage = "Page Not Found"}) => {
    return (
        <div>
            <h1>Error {statusCode}</h1>
            <p>{errorMessage}</p>
        </div>
    );
};
