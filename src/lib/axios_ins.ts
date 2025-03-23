import axios, { AxiosInstance } from "axios";

export const axios_ins : AxiosInstance = axios.create({
    baseURL : "https://guestify-2-0-backend.onrender.com/backend/",
})