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

/**
 * Singleton Token Storage
 * Kept outside of React State to allow non-component access (e.g., helpers)
 */
let inMemoryToken = null;

/**
 * Decodes a JWT and manually parses the payload.
 *
 * @param {string} token
 * @returns {object} JSON payload
 */
const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map((c) => {
                    const sliceString = `00${c.charCodeAt(0).toString(16)}`.slice(-2);
                    return `%${sliceString}`;
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
};

/**
 * Process the API response and update the in-memory token.
 *
 * @param {object} rawData - The response data from the API
 * @param {boolean} isDev - Whether we are in dev mode (parsing differs slightly)
 * @returns {object|null} The formatted token object
 */
const processTokenResponse = (rawData, isDev = false) => {
    // 1. Dev endpoint returns raw JWT string; Prod usually returns { payload: ... }
    // Adjust this line based on your exact API response shape
    const jwt = isDev ? rawData : rawData.payload?.token || rawData.payload;

    if (!jwt) return null;

    const parsed = parseJwt(jwt);

    inMemoryToken = {
        token: jwt,
        // Handle 10-digit (seconds) vs 13-digit (milliseconds) epochs
        expiry: parsed.exp < 1000000000000 ? parsed.exp * 1000 : parsed.exp,
        readableExpiry: getDateFromEpoch(parsed.exp),
        username: parsed.username || parsed.sub, // Fallback to subject if username missing
        guid: parsed.guid,
        tokenType: "BEARER"
    };

    return inMemoryToken;
};

/**
 * Fetch Token (Production)
 * Uses ServiceWrapper for retries and error handling.
 */
const retrieveToken = async () => {
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
        return processTokenResponse(response.data);
    } catch (error) {
        // Handle 401 Unauthorized -> Redirect to Login
        if (error.message && error.message.includes("401")) {
            window.location.replace(START_SESSION_URL);
        }
        return null;
    }
};

/**
 * Fetch Token (Development)
 */
const retrieveTokenDev = async (delay = 0, userOverride = null) => {
    // Optional delay for testing race conditions
    if (delay > 0) {
        await ServiceWrapper.wait(delay);
    }

    const username = userOverride || sessionStorage.getItem("uname") || "public-user";

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
        return processTokenResponse(response.data, true);
    } catch (error) {
        if (error.message && error.message.includes("401")) {
            window.location.replace(START_SESSION_URL);
        }
        return null;
    }
};

/**
 * Helper to read the token synchronously.
 */
const readToken = () => inMemoryToken;

/**
 * Helper to clear session.
 */
const fakeLogout = async () => {
    inMemoryToken = null;
    sessionStorage.removeItem("user_details");
    sessionStorage.removeItem("devLogin");
};

/**
 * React Component: Auth
 * Manages the token lifecycle (refreshing) silently.
 * Does not render UI.
 */
const Auth = () => {
    const { dispatch, state } = useGlobalContext();
    const { username } = state || {};

    // Use a ref to track if a fetch is currently happening to prevent overlaps
    const isFetching = useRef(false);

    useEffect(() => {
        let intervalId;

        const checkAndRefreshToken = async () => {
            if (isFetching.current) return;

            const now = Date.now();
            const shouldRefresh =
                !inMemoryToken ||
                inMemoryToken.expiry - parseInt(EXPIRY_BUFFER_MILLI, 10) < now;

            if (shouldRefresh) {
                isFetching.current = true;
                let newToken = null;

                // Determine Dev vs Prod strategy
                const isDevMode =
                    sessionStorage.getItem("devLogin") === "devLogin" ||
                    process.env.NODE_ENV !== "production";

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

                isFetching.current = false;
            }
        };

        // Run check immediately on mount
        checkAndRefreshToken();

        // Start Interval
        intervalId = setInterval(checkAndRefreshToken, TOKEN_EXPIRY_CHECK_MILLI);

        return () => {
            clearInterval(intervalId);
        };
    }, [dispatch, username]); // Dependency on username ensures we switch users correctly in Dev

    return null;
};

export { Auth, fakeLogout, readToken, retrieveToken, retrieveTokenDev };
