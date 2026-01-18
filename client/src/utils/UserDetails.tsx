import { useEffect, useRef } from "react";

import UserDao from "../dao/UserDao";

import { useGlobalContext } from "../components/contextProvider/ContextProvider";

interface UserDetails {
    [key: string]: unknown;
}

/**
 * Custom hook to manage User Details.
 * 1. Checks sessionStorage for existing details (hydration).
 * 2. If missing, and token/username exist, queries the API.
 * 3. Updates GlobalContext and sessionStorage.
 *
 * @name useUserDetails
 * @returns {UserDetails|null} The user details object or null
 */
const useUserDetails = (): UserDetails | null => {
    const { dispatch, state } = useGlobalContext();
    const { token, userDetails, username } = state || {};

    // Prevent duplicate API calls while one is already in flight
    const isFetching = useRef(false);

    /**
     * Hydrate state from SessionStorage on mount.
     * This ensures if the user refreshes, we don't need an API call if data exists.
     */
    useEffect(() => {
        if (!userDetails) {
            try {
                const storedUserDetails = sessionStorage.getItem("user_details");
                if (storedUserDetails) {
                    const parsedUserDetails = JSON.parse(storedUserDetails);
                    dispatch({ type: "UserDetails", userDetails: parsedUserDetails });
                }
            } catch (error) {
                // Fail silently or handle error state
                console.error("Failed to hydrate user details from session storage", error);
                sessionStorage.removeItem("user_details");
            }
        }
    }, [dispatch, userDetails]);

    /**
     * Fetch User Details from API.
     * Triggered automatically when 'token' and 'username' become available.
     */
    useEffect(() => {
        const shouldFetch = token && username && !userDetails && !isFetching.current;

        const fetchUserDetails = async (): Promise<void> => {
            try {
                isFetching.current = true;

                const options = {
                    action: "userDetailsRead",
                    username: username!,
                    token: token!
                };

                const response = await UserDao(options);
                if (response && response.data) {
                    const { payload } = response.data as { payload: unknown };
                    sessionStorage.setItem("user_details", JSON.stringify(payload));
                    dispatch({ type: "UserDetails", userDetails: payload });
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                // On error, clear storage to ensure a clean state for retry
                sessionStorage.removeItem("user_details");
            } finally {
                isFetching.current = false;
            }
        };

        if (shouldFetch) {
            fetchUserDetails();
        }
    }, [token, username, userDetails, dispatch]);

    return userDetails && typeof userDetails === "object" && Object.keys(userDetails).length > 0
        ? (userDetails as UserDetails)
        : null;
};

export default useUserDetails;
