import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/manage/departments";

interface DepartmentManageApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

const DepartmentManageApi = {
    getAll: async (authHeader: { Authorization: string }): Promise<DepartmentManageApiResponse<any>> => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: authHeader
            });

            return {
                success: true,
                message: "Departments fetched successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to fetch departments:", error);
            return {
                success: false,
                message: "Failed to fetch departments"
            }
        }
    },

    getById: async (authHeader: { Authorization: string }, id: string): Promise<DepartmentManageApiResponse<any>> => {
        try {
            const response = await axios.get(API_BASE_URL + "/" + id, {
                headers: authHeader
            });

            return {
                success: true,
                message: "Department fetched successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to fetch department:", error);
            return {
                success: false,
                message: "Failed to fetch department"
            }
        }
    },

    create: async (authHeader: { Authorization: string }, name: string): Promise<DepartmentManageApiResponse<any>> => {
        try {
            const response = await axios.post(API_BASE_URL, {
                departmentName: name
            }, {
                headers: authHeader
            });
            return {
                success: true,
                message: "Department created successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to fetch department:", error);
            return {
                success: false,
                message: "Failed to fetch department"
            }
        }
    },

    update: async (authHeader: {
        Authorization: string
    }, id: string, name: string): Promise<DepartmentManageApiResponse<any>> => {
        try {
            const response = await axios.put(API_BASE_URL + "/" + id, {
                departmentName: name
            }, {
                headers: authHeader
            });
            return {
                success: true,
                message: "Department updated successfully",
                data: response.data
            }

        } catch (error) {
            console.error("Failed to fetch department:", error);
            return {
                success: false,
                message: "Failed to fetch department"
            }
        }
    },

    delete: async (authHeader: { Authorization: string }, id: string): Promise<DepartmentManageApiResponse<any>> => {
        try {
            const response = await axios.delete(API_BASE_URL + "/" + id, {
                headers: authHeader
            });
            return {
                success: true,
                message: "Department deleted successfully",
                data: response.data
            }
        } catch (error) {
            console.error("Failed to fetch department:", error);
            return {
                success: false,
                message: "Failed to fetch department"
            }
        }
    }
}

export default DepartmentManageApi;