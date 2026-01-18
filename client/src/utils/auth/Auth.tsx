import { useEffect, useRef } from "react";

import ServiceWrapper from "../../utils/ServiceWrapper";
import {
    EXPIRY_BUFFER_MILLI,
    SERVICE_HOST,
    START_SESSION_URL,
    TOKEN_EXPIRY_CHECK_MILLI,
    TOKEN_URL,
    TOKEN_URL_DEV
} from "./config";
import { getDateFromEpoch } from "../DateFormatter";
import { useGlobalContext } from "../../components/contextProvider/ContextProvider";

interface TokenData {
    token: string;
    expiry: number;
    readableExpiry: string;
    username: string;
    guid: string;
    tokenType: string;
    [key: string]: string | number; // Index signature for compatibility
}

/**
 * Singleton Token Storage
 * Kept outside of React State to allow non-component access (e.g., helpers)
 */
let inMemoryToken: TokenData | null = null;

/**
 * Decodes a JWT and manually parses the payload.
 */
const parseJwt = (token: string): Record<string, unknown> => {
    if (!token || typeof token !== "string") {
        console.error("Invalid token provided to parseJwt");
        return {};
    }

    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) {
            console.error("Invalid JWT structure");
            return {};
        }
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map((c: string): string => {
                    const sliceString = `00${c.charCodeAt(0).toString(16)}`.slice(-2);
                    return `%${sliceString}`;
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        console.error("Failed to parse JWT");
        return {};
    }
};

/**
 * Process the API response and update the in-memory token.
 */
const processTokenResponse = (rawData: unknown, isDev = false): TokenData | null => {
    if (!rawData) {
        console.error("No data provided to processTokenResponse");
        return null;
    }

    // 1. Dev endpoint returns raw JWT string; Prod usually returns { payload: ... }
    // Adjust this line based on your exact API response shape
    let jwt: string;
    if (isDev) {
        // Dev mode: handle both string and object responses
        if (typeof rawData === "string") {
            // Decode HTML entities that might be present
            jwt = rawData
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">");
        } else if (rawData && typeof rawData === "object") {
            // Handle case where dev endpoint returns {token: "..."} or similar
            const data = rawData as { token?: string; payload?: string };
            jwt = data.token || data.payload || "";
        } else {
            console.error("Unexpected data format for dev mode:", typeof rawData);
            return null;
        }
    } else {
        if (!rawData || typeof rawData !== "object") {
            console.error("Expected object data for production mode");
            return null;
        }
        const data = rawData as { payload?: { token?: string } | string };
        if (typeof data.payload === "string") {
            jwt = data.payload;
        } else {
            jwt = data.payload?.token || "";
        }
    }

    if (!jwt) {
        console.error("No JWT extracted from response");
        return null;
    }

    // Validate JWT structure (should have 3 parts)
    if (jwt.split(".").length !== 3) {
        console.error("Invalid JWT token structure - parts:", jwt.split(".").length);
        return null;
    }

    const parsed = parseJwt(jwt);

    // Validate parsed JWT has required fields
    if (!parsed || typeof parsed !== "object") {
        console.error("Failed to parse JWT payload");
        return null;
    }

    const exp = typeof parsed.exp === "number" ? parsed.exp : 0;
    const username =
        typeof parsed.username === "string" ? parsed.username : typeof parsed.sub === "string" ? parsed.sub : "";
    const guid = typeof parsed.guid === "string" ? parsed.guid : "";

    try {
        inMemoryToken = {
            token: jwt,
            // Handle 10-digit (seconds) vs 13-digit (milliseconds) epochs
            expiry: exp < 1000000000000 ? exp * 1000 : exp,
            readableExpiry: getDateFromEpoch(exp),
            username,
            guid,
            tokenType: "Bearer"
        };

        return inMemoryToken;
    } catch (error) {
        console.error("Error creating token object:", error);
        return null;
    }
};

/**
 * Fetch Token (Production)
 * Uses ServiceWrapper for retries and error handling.
 */
const retrieveToken = async (): Promise<TokenData | null> => {
    const options = {
        url: TOKEN_URL,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": SERVICE_HOST
        },
        withCredentials: true
    };

    try {
        const response = await ServiceWrapper.serviceCall({ options });
        return processTokenResponse((response as { data: unknown }).data);
    } catch (error: unknown) {
        // Handle 401 Unauthorized -> Redirect to Login
        if (error instanceof Error && error.message && error.message.includes("401")) {
            window.location.replace(START_SESSION_URL);
        }
        return null;
    }
};

/**
 * Fetch Token (Development)
 */
const retrieveTokenDev = async (delay = 0, userOverride: string | null = null): Promise<TokenData | null> => {
    // Optional delay for testing race conditions
    if (delay > 0) {
        await ServiceWrapper.wait(delay);
    }

    const username = userOverride || sessionStorage.getItem("uname");

    if (!username) {
        console.error("No username available for dev token retrieval");
        return null;
    }

    const options = {
        url: `${TOKEN_URL_DEV}/${username}/token`,
        method: "GET", // Changed from POST based on your snippet using axios.get
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": SERVICE_HOST
        },
        withCredentials: true
    };

    try {
        const response = await ServiceWrapper.serviceCall({ options });
        return processTokenResponse((response as { data: unknown }).data, true);
    } catch (error: unknown) {
        // In dev mode, don't redirect on token failures - just return null
        if (
            process.env.NODE_ENV === "production" &&
            error instanceof Error &&
            error.message &&
            error.message.includes("401")
        ) {
            window.location.replace(START_SESSION_URL);
        }
        return null;
    }
};

/**
 * Helper to read the token synchronously.
 */
const readToken = (): TokenData | null => inMemoryToken;

/**
 * Helper to clear session.
 */
const fakeLogout = async (): Promise<void> => {
    inMemoryToken = null;
    sessionStorage.removeItem("user_details");
    sessionStorage.removeItem("devLogin");
};

/**
 * React Component: Auth
 * Manages the token lifecycle (refreshing) silently.
 * Does not render UI.
 */
const Auth = (): null => {
    const { dispatch, state } = useGlobalContext();
    const { username } = state || {};

    // Use a ref to track if a fetch is currently happening to prevent overlaps
    const isFetching = useRef(false);

    useEffect(() => {
        // eslint-disable-next-line prefer-const
        let intervalId: NodeJS.Timeout;

        const checkAndRefreshToken = async (): Promise<void> => {
            if (isFetching.current) return;

            const now = Date.now();
            const shouldRefresh = !inMemoryToken || inMemoryToken.expiry - Number(EXPIRY_BUFFER_MILLI) < now;

            if (shouldRefresh) {
                isFetching.current = true;
                let newToken = null;

                try {
                    // Determine Dev vs Prod strategy
                    const isDevMode =
                        sessionStorage.getItem("devLogin") === "devLogin" || process.env.NODE_ENV !== "production";

                    if (isDevMode) {
                        // Pass the username from Context if available
                        newToken = await retrieveTokenDev(0, username);
                    } else {
                        newToken = await retrieveToken();
                    }

                    // If we got a token, update Context
                    if (newToken) {
                        dispatch({ type: "Token", token: newToken.token });
                        if (newToken.username) {
                            dispatch({ type: "Username", username: newToken.username });
                        }
                    }
                } catch {
                    // Don't redirect on token refresh failures in dev mode
                    console.error("Token refresh failed");
                } finally {
                    isFetching.current = false;
                }
            }
        };

        // Run check immediately on mount
        checkAndRefreshToken();

        // Start Interval
        /* eslint-disable-next-line */
        intervalId = setInterval(checkAndRefreshToken, TOKEN_EXPIRY_CHECK_MILLI);

        return (): void => {
            clearInterval(intervalId);
        };
    }, [dispatch, username]); // Dependency on username ensures we switch users correctly in Dev

    return null;
};

export { Auth, fakeLogout, readToken, retrieveToken, retrieveTokenDev };
