import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/";

interface AuthenticateApiResponse<T> {
    success: boolean,
    message: string,
    data?: T
}

const authenticateApi = {
    login: async (username: string, password: string): Promise<AuthenticateApiResponse<any>> => {
        try {
            const response = await axios.post(API_BASE_URL + "auth/login", {
                username,
                password
            });
            return {
                success: true,
                message: response.status === 200 ? "Login successful" : "Login failed",
                data: response.data
            }
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                message: "Login failed",
            }
        }
    },

    register: async (username: string, password: string): Promise<AuthenticateApiResponse<any>> => {
        try {
            const response = await axios.post(API_BASE_URL + "auth/register", {
                username,
                password
            });
            return {
                success: true,
                message: response.status === 200 ? "Registration successful" : "Registration failed",
                data: response.data
            }
        } catch (error) {
            console.error("Registration failed:", error);
            return {
                success: false,
                message: "Registration failed",
            }
        }
    },
};

export default authenticateApi;