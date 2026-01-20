import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://musichub-admin-x6wd.onrender.com', // Backend URL
    withCredentials: true, // For handling cookies
});

export default instance;
