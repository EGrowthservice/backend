export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export class ApiResponseHandler {
    static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
        return {
            success: true,
            message,
            data
        };
    }

    static error(message: string, error?: any): ApiResponse<null> {
        return {
            success: false,
            message,
            error
        };
    }
}