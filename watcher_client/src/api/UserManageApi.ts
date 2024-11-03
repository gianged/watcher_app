import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/manage/users";

interface UserManageApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

const UserManageApi = {
    getPaged: async (authHeader: { Authorization: string }, page: number, size: number, username: string = "", sortDir: string = "desc"): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/paged`, {
                headers: authHeader,
                params: {
                    username,
                    page,
                    size,
                    sortBy: "id",
                    sortDir
                }
            });
            return {
                success: true,
                message: "Paged users fetched successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to fetch paged users:", error);
            return {
                success: false,
                message: "Failed to fetch paged users"
            }
        }
    },

    getAll: async (authHeader: { Authorization: string }): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.get(
                API_BASE_URL, {
                    headers: authHeader
                }
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

    getById: async (authHeader: { Authorization: string }, id: string): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.get(
                API_BASE_URL + `/${id}`, {
                    headers: authHeader
                }
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
    },

    create: async (authHeader: { Authorization: string }, userDto: {
        username: string,
        password: string,
        departmentId: string | null,
        roleLevel: number,
        isActive: boolean
    }): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.post(
                API_BASE_URL, {
                    username: userDto.username,
                    password: userDto.password,
                    departmentId: userDto.departmentId,
                    roleLevel: userDto.roleLevel,
                    isActive: userDto.isActive
                }, {
                    headers: authHeader
                }
            )

            return {
                success: true,
                message: "User created successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to create user:", error);
            return {
                success: false,
                message: "Failed to create user"
            }
        }
    },

    update: async (authHeader: { Authorization: string }, id: string, userDto: {
        username: string,
        password: string,
        departmentId: string | null,
        roleLevel: number,
        isActive: boolean
    }): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.put(
                API_BASE_URL + `/${id}`, {
                    username: userDto.username,
                    password: userDto.password,
                    departmentId: userDto.departmentId,
                    roleLevel: userDto.roleLevel,
                    isActive: userDto.isActive
                }, {
                    headers: authHeader
                }
            )
            return {
                success: true,
                message: "User updated successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to update user:", error);
            return {
                success: false,
                message: "Failed to update user"
            }
        }
    },

    delete: async (authHeader: { Authorization: string }, id: string): Promise<UserManageApiResponse<any>> => {
        try {
            const response = await axios.delete(
                API_BASE_URL + `/${id}`, {
                    headers: authHeader
                }
            )
            return {
                success: true,
                message: "User deleted successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
            return {
                success: false,
                message: "Failed to delete user"
            }
        }
    }
}

export default UserManageApi;