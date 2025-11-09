import React, { useEffect, useState } from 'react';
import { getAllTickets } from '../services/ticketService';
import type { Ticket } from '../types/Ticket';

const TicketList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Hàm để load danh sách tickets
    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await getAllTickets();
            setTickets(data);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError('Failed to load tickets. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchTickets khi component được mount
    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div>
            <h1>Ticket List</h1>

            {/* Hiển thị trạng thái loading */}
            {loading && <p>Loading tickets...</p>}

            {/* Hiển thị lỗi nếu có */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Hiển thị danh sách tickets */}
            {!loading && !error && tickets.length > 0 && (
                <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.category}</td>
                                <td>{ticket.priority}</td>
                                <td>{ticket.status}</td>
                                <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Hiển thị thông báo nếu không có tickets */}
            {!loading && !error && tickets.length === 0 && <p>No tickets found.</p>}
        </div>
    );
};

export default TicketList;