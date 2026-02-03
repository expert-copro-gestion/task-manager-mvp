import axios from 'axios';

const API_BASE_URL = 'http://localhost';
const AUTH_SERVICE = `${API_BASE_URL}:3001`;
const TASK_SERVICE = `${API_BASE_URL}:3003`;
const USER_SERVICE = `${API_BASE_URL}:3002`;

const axiosInstance = axios.create();

// Ajouter le token JWT automatiquement
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Gérer les erreurs 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) =>
        axiosInstance.post(`${AUTH_SERVICE}/auth/login`, { email, password }),

    signup: (name, email, password, orgCode) =>
        axiosInstance.post(`${AUTH_SERVICE}/auth/signup`, {
            name,
            email,
            password,
            orgCode,
        }),

    verifyToken: (token) =>
        axiosInstance.post(`${AUTH_SERVICE}/verify-token`, { token }),
};

export const taskAPI = {
    getTasks: (orgId) =>
        axiosInstance.get(`${TASK_SERVICE}/tasks`, { params: { orgId } }),

    createTask: (title, description, assignedTo, orgId) =>
        axiosInstance.post(`${TASK_SERVICE}/tasks`, {
            title,
            description,
            assignedTo: assignedTo,
            org_id: orgId,
        }),

    updateTask: (taskId, completed) =>
        axiosInstance.patch(`${TASK_SERVICE}/tasks/${taskId}`, { completed }),

    deleteTask: (taskId) =>
        axiosInstance.delete(`${TASK_SERVICE}/tasks/${taskId}`),
};

export const userAPI = {
    getUsers: (orgId) =>
        axiosInstance.get(`${USER_SERVICE}/users`, { params: { orgId } }),

    getUser: (userId) =>
        axiosInstance.get(`${USER_SERVICE}/users/${userId}`),

    updateUser: (userId, updates) =>
        axiosInstance.patch(`${USER_SERVICE}/users/${userId}`, updates),

    validateOrgCode: (code) =>
        axiosInstance.get(`${USER_SERVICE}/organizations/${code}`),
};

export default axiosInstance;