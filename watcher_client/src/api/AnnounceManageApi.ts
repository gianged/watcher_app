import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/manage/announces";

const AnnounceManageApi = {
    getPaged: async (authHeader: {
        Authorization: string
    }, page: number, size: number, content: string = "", sortDir: string = "desc") => {
        try {
            const response = await axios.get(`${API_BASE_URL}/paged`, {
                headers: authHeader,
                params: {
                    content,
                    page,
                    size,
                    sortBy: "id",
                    sortDir
                }
            });

            return {
                success: true,
                message: "Paged announcements fetched successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to fetch paged announcements:", error);
            return {
                success: false,
                message: "Failed to fetch paged announcements"
            };
        }
    },

    getAll: async (authHeader: { Authorization: string }) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: authHeader
            });

            return {
                success: true,
                message: "Announcements fetched successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
            return {
                success: false,
                message: "Failed to fetch announcements"
            };
        }
    },

    getById: async (authHeader: { Authorization: string }, id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`, {
                headers: authHeader
            });

            return {
                success: true,
                message: "Announcement fetched successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to fetch announcement:", error);
            return {
                success: false,
                message: "Failed to fetch announcement"
            };
        }
    },

    create: async (authHeader: { Authorization: string }, announceDto: {
        content: string,
        startDate: string,
        endDate: string,
        departmentId: number | null,
        isPublic: boolean,
        isActive: boolean
    }) => {
        try {
            const response = await axios.post(API_BASE_URL, announceDto, {
                headers: authHeader
            });

            return {
                success: true,
                message: "Announcement created successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to create announcement:", error);
            return {
                success: false,
                message: "Failed to create announcement"
            };
        }
    },

    update: async (authHeader: { Authorization: string }, id: string, announceDto: {
        content: string,
        startDate: string,
        endDate: string,
        departmentId: number | null,
        isPublic: boolean,
        isActive: boolean
    }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, announceDto, {
                headers: authHeader
            });

            return {
                success: true,
                message: "Announcement updated successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to update announcement:", error);
            return {
                success: false,
                message: "Failed to update announcement"
            };
        }
    },

    delete: async (authHeader: { Authorization: string }, id: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: authHeader
            });

            return {
                success: true,
                message: "Announcement deleted successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to delete announcement:", error);
            return {
                success: false,
                message: "Failed to delete announcement"
            };
        }
    }
};

export default AnnounceManageApi;