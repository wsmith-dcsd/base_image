import axios from "axios";

import { SERVICE_HOST } from "./auth/config";

/**
 * Uses axios - method, url, event listeners, etc. are passed into the options
 * param as an object.
 * @name ServiceWrapper
 * @static
 * @param {{}} options
 * @returns {Promise<any>}
 */
const axiosInstance = axios.create({
    baseURL: SERVICE_HOST,
    timeout: 90000, // one and a half minutes before giving up
    headers: { "Content-Type": "application/json", "Access-Control-Max-Age": 86400 },
    withCredentials: true
});

/**
 * Determines if a request method is idempotent (safe to retry)
 */
const isIdempotentMethod = (method: string | undefined): boolean => {
    return ["GET", "HEAD", "OPTIONS", "DELETE"].includes(method?.toUpperCase() || "");
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error): Promise<unknown> => {
        const config = error.config;
        const { method } = config;
        // Add a custom retry count if it doesn't exist
        if (!config.__retryCount) {
            config.__retryCount = 0;
        }

        // Max number of retries
        const MAX_RETRIES = 3;

        // ONLY retry if the error is a 5xx AND the method is idempotent
        const shouldRetry =
            error.response &&
            error.response.status >= 500 &&
            config.__retryCount < MAX_RETRIES &&
            isIdempotentMethod(method);

        if (shouldRetry) {
            config.__retryCount += 1;

            // Optional: wait before retrying (simple backoff)
            await ServiceWrapper.wait(500 * config.__retryCount);

            // Retry the request
            return axiosInstance(config);
        }

        // Otherwise, reject the promise
        return Promise.reject(error);
    }
);

const pendingRequests = new Map<string, Promise<{ data: unknown }>>();
interface ServiceOptions {
    url: string;
    method: string;
    data?: unknown;
    headers?: Record<string, string>;
    params?: unknown;
    withCredentials?: boolean;
    [key: string]: unknown;
}

const ServiceWrapper = (options: ServiceOptions): Promise<{ data: unknown }> => axiosInstance(options);

/**
 * Do we have a workable status? If not, throw an error with the status text
 * @name checkStatus
 * @static
 * @param {{}} response
 * @return {{}} response
 * @throws {Error} error
 */
ServiceWrapper.checkStatus = (response: { status: number }): { status: number } => {
    // Success status is any 200s response
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(`HTTP ${response.status}`);
};

// Helper wait function
ServiceWrapper.wait = (ms: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
};

/**
 * Detect the type of error and return the appropriate message
 * @name errorHandler
 * @static
 * @param {{}|string|null} error
 * @return {string|*}
 */
ServiceWrapper.errorHandler = (error: unknown): string => {
    if (error && typeof error === "object" && "response" in error) {
        const errorObj = error as { response: { status: number; data: unknown } };
        const { status, data } = errorObj.response;

        return `${status}: ${typeof data === "string" ? data : JSON.stringify(data)}`;
    }
    if (error && typeof error === "object" && "request" in error) {
        return "No response received from server";
    }
    if (error && typeof error === "object" && "message" in error) {
        return (error as { message: string }).message;
    }

    return "Unknown error";
};

/**
 * Convert response headers into an array
 * @name responseHeadersAsArray
 * @static
 * @param {{}} response
 * @return {[]} headers
 */
ServiceWrapper.responseHeadersAsArray = (response: unknown): unknown => {
    if (response && typeof response === "object" && "headers" in response) {
        return { ...(response as { headers: Record<string, unknown> }).headers };
    }
    return {};
};

/**
 * Perform CRUD operations with an API
 */
ServiceWrapper.serviceCall = async ({ options }: { options: ServiceOptions }): Promise<{ data: unknown }> => {
    const keyData = {
        url: options.url,
        method: options.method,
        data: options.data
    };

    const key = JSON.stringify(keyData);
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key)!;
    }

    const promise = ServiceWrapper(options)
        .catch((error) => {
            pendingRequests.delete(key);
            throw new Error(ServiceWrapper.errorHandler(error));
        })
        .finally(() => {
            pendingRequests.delete(key);
        });

    pendingRequests.set(key, promise);

    return promise;
};

export default ServiceWrapper;
export type { ServiceOptions };
