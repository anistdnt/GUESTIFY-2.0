import { AxiosRequestConfig, isAxiosError } from "axios";
import { axios_ins, axios_base } from "./axios_ins";

interface BaseApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface ApiReturn<T> {
    success?: boolean;
    data?: T;
    results?:T;
    message?: string;
    error?: string;
    status?: number;
}

const handleApiRequest = async <T>(
    config: AxiosRequestConfig
): Promise<ApiReturn<T>> => {
    try {
        const urlPath = config.url || "";
        const isPublicRoute = ["/loginUser", "/registerUser"].some((path) =>
            urlPath.includes(path)
        );

        const instance = isPublicRoute ? axios_base : axios_ins;

        const response = await instance.request<BaseApiResponse<T>>(config);

        return {
            success: true,
            data: response.data.data as T,
            message: response.data.message,
            status: response.status,
        };
    } catch (err: unknown) {
        console.log(err);
        let errorMessage = "Something went wrong";
        let CauseError = null;
        let status = 500;

        if (isAxiosError(err)) {
            status = err.response?.status || 500;
            errorMessage = err.response?.data?.message || err.message || errorMessage;
            CauseError = err.response?.data?.error;
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            success: false,
            error: CauseError,
            message : errorMessage,
            status,
        };
    }
};

// the api caller  
export const api_caller = async <T, R = unknown>(
    method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH",
    url: string,
    data?: R
): Promise<ApiReturn<T>> => {
    const result = await handleApiRequest<T>({
        method,
        url,
        data,
    });

    if (result.success) {
        // console.log("Success:", result.data);
        // console.log("hii")
        return result;
    } else {
        console.log("Error:", result.error);
        return result;
    }
};
