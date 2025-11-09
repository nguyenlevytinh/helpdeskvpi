import { fetchData, postData } from './api';
import type { Ticket, TicketCreateDto } from '../types/Ticket';

// Hàm để lấy danh sách tất cả tickets từ backend
export const getAllTickets = async (): Promise<Ticket[]> => {
    try {
        const tickets = await fetchData('/api/TicketCreate');
        return tickets as Ticket[];
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
};

// Hàm để tạo một ticket mới trên backend
export const createTicket = async (ticketData: TicketCreateDto): Promise<Ticket> => {
    try {
        const ticket = await postData('/api/TicketCreate', ticketData);
        return ticket as Ticket;
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};