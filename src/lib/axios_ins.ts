import axios, { AxiosInstance } from "axios";

export const axios_ins : AxiosInstance = axios.create({
    baseURL : process.env.NEXT_PUBLIC_SERVER_URL,
})