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
                success: true,
                message: "Login successful",
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
                success: true,
                message: "Registration successful",
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
            await axios.post(API_BASE_URL + "auth/logout");
            return {
                success: true,
                message: "Logout successful"
            }
        } catch (error) {
            console.error("Error happened during logout:", error);
            return {
                message: "Logout failed",
                success: false
            }
        }
    },

    updateUser: async (id: string, newPassword?: string, newProfilePicture?: File | string): Promise<AuthenticateApiResponse<any>> => {
        try {
            const formData = new FormData();
            formData.append('id', id.toString());
            if (newPassword) formData.append('newPassword', newPassword);
            if (newProfilePicture instanceof File) {
                formData.append('newProfilePicture', newProfilePicture);
            } else if (typeof newProfilePicture === 'string') {
                formData.append('newProfilePicture', newProfilePicture);
            }

            const response = await axios.put(`${API_BASE_URL}auth/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return {
                success: true,
                message: "User updated successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to update user:", error);
            return {
                success: false,
                message: "Failed to update user"
            };
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