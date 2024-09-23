import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/";

interface UserManageApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

const UserManageApi = {
    fillAll = async (): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.get(
                API_BASE_URL + "users/all"
            );
            if (response.status === 200) {
                return {
                    success: true,
                    message: "Users fetched successfully",
                    data: response.data
                }
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            return {
                success: false,
                message: "Failed to fetch users"
            }
        }
    }
}

export default UserManageApi;