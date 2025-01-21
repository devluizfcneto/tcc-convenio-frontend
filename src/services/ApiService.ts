import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_URL_BASE_API ? import.meta.env.VITE_URL_BASE_API : "http://localhost:3001/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default http;