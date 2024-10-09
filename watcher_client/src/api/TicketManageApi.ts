import axios from "axios";

const API_BASE_URL = "http://localhost:8081/watcher/tickets";

type TicketManageApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
};

const TicketManageApi = {
        getAll: async (authHeader: { Authorization: string }): Promise<TicketManageApiResponse<any>> => {
            try {
                const response = await axios.get(API_BASE_URL, {headers: authHeader});
                return {
                    success: true,
                    message: "Tickets fetched successfully",
                    data: response.data
                };
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
                return {
                    success: false,
                    message: "Failed to fetch tickets"
                };
            }
        },

        getById: async (authHeader: { Authorization: string }, id: number): Promise<TicketManageApiResponse<any>> => {
            try {
                const response = await axios.get(`${API_BASE_URL}/${id}`, {headers: authHeader});
                return {
                    success: true,
                    message: "Ticket fetched successfully",
                    data: response.data
                };
            } catch (error) {
                console.error("Failed to fetch ticket:", error);
                return {
                    success: false,
                    message: "Failed to fetch ticket"
                };
            }
        },

        create: async (authHeader: { Authorization: string }, ticketDto: {
            appUserId: number;
            content: string;
            status: number;
            isActive: boolean
        }): Promise<TicketManageApiResponse<any>> => {
            try {
                const response = await axios.post(API_BASE_URL, ticketDto, {headers: authHeader});
                return {
                    success: true,
                    message: "Ticket created successfully",
                    data: response.data
                };
            } catch (error) {
                console.error("Failed to create ticket:", error);
                return {
                    success: false,
                    message: "Failed to create ticket"
                };
            }
        },

        update: async (authHeader: { Authorization: string }, id: number, ticketDto: {
            appUserId: number;
            content: string;
            status: number;
            isActive: boolean;
        }): Promise<TicketManageApiResponse<any>> => {
            try {
                const response = await axios.put(`${API_BASE_URL}/${id}`, ticketDto, {headers: authHeader});
                return {
                    success: true,
                    message: "Ticket updated successfully",
                    data: response.data
                };
            } catch (error) {
                console.error("Failed to update ticket:", error);
                return {
                    success: false,
                    message: "Failed to update ticket"
                };
            }
        }
        ,

        delete: async (authHeader: { Authorization: string }, id: number): Promise<TicketManageApiResponse<null>> => {
            try {
                const response = await axios.delete(`${API_BASE_URL}/${id}`, {headers: authHeader});
                return {
                    success: true,
                    message: "Ticket deleted successfully",
                    data: response.data
                };
            } catch (error) {
                console.error("Failed to delete ticket:", error);
                return {
                    success: false,
                    message: "Failed to delete ticket"
                };
            }
        }
    }
;

export default TicketManageApi;