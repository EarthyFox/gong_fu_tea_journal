const API_BASE_URL = '/api';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) throw response;
        return response.json();
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('API Error:', response.status, text);
            try {
                // Try parsing JSON error if possible
                throw { json: async () => JSON.parse(text), status: response.status };
            } catch (e) {
                // If not JSON, throw text
                throw new Error(`API Error ${response.status}: ${text}`);
            }
        }
        return response.json();
    },

    put: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw response;
        return response.json();
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw response;
        return response.json();
    },
};
