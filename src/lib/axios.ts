
import axios from 'axios';


axios.defaults.baseURL = 'http://192.168.0.206:6003';
axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userData') || '{}').jwt_token || ''}`;
    return config;
});