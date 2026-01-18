import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import LoadingSvg from "./LoadingSvg";

import { Auth, retrieveToken, retrieveTokenDev } from "../utils/auth/Auth";
import { ContextProvider } from "./contextProvider/ContextProvider";

interface TokenObject {
    token: string;
    username: string;
    expiry: number;
    [key: string]: unknown;
}

const PrivateRoute = (): React.JSX.Element => {
    const [tokenObject, setTokenObject] = useState<TokenObject | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const handleToken = async (): Promise<void> => {
            try {
                let fetchedToken = null;
                const isDev = process.env.NODE_ENV !== "production";

                if (isDev && sessionStorage.getItem("devLogin") === "devLogin") {
                    // Development Mode with Session Override - get username from sessionStorage
                    const devUser = sessionStorage.getItem("uname");
                    if (devUser) {
                        fetchedToken = await retrieveTokenDev(0, devUser);
                    } else {
                        // No username in session, redirect to login
                        window.location.href = "/backdoor";
                        return;
                    }
                } else if (isDev) {
                    // Development Mode with default user
                    const devUser = process.env.REACT_APP_DEV_USER;
                    if (devUser) {
                        fetchedToken = await retrieveTokenDev(0, devUser);
                    } else {
                        // No default user configured, redirect to login
                        window.location.href = "/backdoor";
                        return;
                    }
                } else {
                    // Production Mode
                    fetchedToken = await retrieveToken();
                }

                if (isMounted) {
                    setTokenObject(fetchedToken);
                    setIsLoading(false);
                }
            } catch {
                console.error("Error fetching token");
                // Handle error (e.g., clear session) if needed
                setTokenObject(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        handleToken();

        return (): void => {
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
