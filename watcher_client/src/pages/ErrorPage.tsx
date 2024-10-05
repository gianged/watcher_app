import React, { useEffect } from "react";
import axios from "axios";
import { ErrorComponent } from "../components/ErrorComponent.tsx";

export const ErrorPage: React.FC = () => {
    const [statusCode, setStatusCode] = React.useState<number>(0);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    useEffect(() => {
        const fetchErrorMessage = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8081/watcher/error");
                setStatusCode(response.data.statusCode)
                setErrorMessage(response.data.errorMessage);
            } catch (error) {
                console.error("Failed to fetch error message:", error);
                setStatusCode(500);
                setErrorMessage("An unexpected error occurred.");
            }
        };

        fetchErrorMessage().then();
    }, []);

    return <ErrorComponent statusCode={statusCode} errorMessage={errorMessage} />;
}
