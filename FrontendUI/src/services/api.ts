import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5017',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Example of a GET request
export const fetchData = async (endpoint: string, params?: Record<string, any>) => {
    try {
        const response = await api.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Example of a POST request
export const postData = async (endpoint: string, data: Record<string, any>) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

export default api;