
import axios from 'axios';


axios.defaults.baseURL = import.meta.env.VITE_CHAT_API_URL || 'http://192.168.0.206:6003';
axios.interceptors.request.use((config) => {
    const token = window.ChatApp ? window.ChatApp.getToken() : (document.cookie.match(/(?:^|;)\s*Token=([^;]+)/) || [0, ''])[1]
    if(!token) {
        throw new Error('Cannot get token for API!')
    }
    config.headers.Authorization = `Bearer ${token || ''}`;
    return config;
});

export default axios;
