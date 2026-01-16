import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import LoadingSvg from "./LoadingSvg";

import { Auth, retrieveToken, retrieveTokenDev } from "../utils/auth/Auth";
import { ContextProvider } from "./contextProvider/ContextProvider";

const PrivateRoute = () => {
    // Note: 'tokenObject' contains { token, username, expiry, ... }
    const [tokenObject, setTokenObject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const handleToken = async () => {
            try {
                let fetchedToken = null;
                const isDev = process.env.NODE_ENV !== "production";
                const devUser = "public-user"; // Move hardcoded string here or to .env

                if (isDev && devUser) {
                    // Development Mode with specific user
                    fetchedToken = await retrieveTokenDev(0, devUser);
                } else if (isDev && sessionStorage.getItem("devLogin") === "devLogin") {
                    // Development Mode with Session Override
                    fetchedToken = await retrieveTokenDev(0, null);
                } else {
                    // Production Mode
                    fetchedToken = await retrieveToken();
                }

                if (isMounted) {
                    setTokenObject(fetchedToken);
                    setIsLoading(false);
                }
            } catch (error) {
                // VIOLATION AVOIDED: 'no-console'
                // Handle error (e.g., clear session) if needed
                setToken(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        handleToken();

        return () => {
            isMounted = false;
        };
    }, []);

    // 1. Show Loader while checking token (prevents flashing Login screen)
    if (isLoading) {
        return <LoadingSvg fullScreen message="Authenticating..." />;
    }

    // 2. If Token exists, Render App wrapped in Context
    // Pass the fetched token so Context starts 'logged in'
    return tokenObject ? (
        <ContextProvider initialToken={tokenObject.token} initialUsername={tokenObject.username}>
            <Outlet />
            {/* Auth component kept if it handles silent refreshes/timers */}
            <Auth />
        </ContextProvider>
    ) : (
        // 3. No Token? Render Auth (presumably redirects to SSO/Login)
        <Auth />
    );
};

export default PrivateRoute;
