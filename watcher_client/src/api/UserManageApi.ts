import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/";

interface UserManageApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

const UserManageApi = {
    getAll: async (): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.get(
                API_BASE_URL + "users/all"
            );
            return {
                success: true,
                message: "Users fetched successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            return {
                success: false,
                message: "Failed to fetch users"
            }
        }
    },

    getById: async (id: string): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.get(
                API_BASE_URL + "users/" + id
            );
            return {
                success: true,
                message: "User fetched successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            return {
                success: false,
                message: "Failed to fetch user"
            }
        }
    }
}

export default UserManageApi;