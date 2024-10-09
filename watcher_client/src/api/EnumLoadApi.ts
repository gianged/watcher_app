import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/enums";

interface EnumApiType<T> {
    success: boolean
    message: string
    data?: T
}

const LoadEnumApi = {
    getRoles: async (): (Promise<EnumApiType<any>>) => {
        try {
            const response = await axios.get(API_BASE_URL + "/roles");
            return {
                success: true,
                message: "Roles fetched successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            return {
                success: false,
                message: "Failed to fetch roles"
            };
        }
    },

    getTicketStatus: async (): (Promise<EnumApiType<any>>) => {
        try {
            const response = await axios.get(API_BASE_URL + "/ticket-status");
            return {
                success: true,
                message: "Ticket status fetched successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Failed to fetch ticket status:", error);
            return {
                success: false,
                message: "Failed to fetch ticket status"
            };
        }
    }
}

export default LoadEnumApi;