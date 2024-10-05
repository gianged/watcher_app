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
                username: username,
                password: password
            });
            return {
                success: response.status === 200,
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
                username: username,
                password: password
            });
            return {
                success: response.status === 200,
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

    logout: async (): Promise<AuthenticateApiResponse<any>> => {
        try {
            const response = await axios.post(API_BASE_URL + "auth/logout");
            return {
                message: response.status === 200 ? "Logout successful" : "Logout failed",
                success: response.status === 200
            }
        } catch (error) {
            console.error("Error happened during logout:", error);
            return {
                message: "Logout failed",
                success: false
            }
        }
    },

    checkUsername: async (input: string): Promise<boolean> => {
        try {
            if (!(input.length === 0)) {
                const response = await axios.get(API_BASE_URL + "auth/check-username", {
                    params: {
                        input: input
                    }
                });
                return response.data === false;
            }
            return false;
        } catch (error) {
            console.error("Failed to connect to server:", error);
            return false;
        }
    }
};

export default authenticateApi;