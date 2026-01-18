import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "./contextProvider/ContextProvider";
import { retrieveTokenDev } from "../utils/auth/Auth";

/**
 * IMPORTANT - This is for Testing only - this component will only load when NODE_ENV !== "production"
 * Take a username to store in context and load home page
 */
const LoadTest = (): React.JSX.Element => {
    const { userName } = useParams();
    const navigate = useNavigate();
    const { dispatch, state } = useGlobalContext();
    const { username } = state || {};
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        const shouldValidate = userName && !username && !isValidating;

        if (shouldValidate) {
            setIsValidating(true);

            const validateUsername = async (): Promise<void> => {
                try {
                    const token = await retrieveTokenDev(0, userName!);
                    if (token) {
                        // Valid username - set in context and sessionStorage
                        console.error("Username validation successful");
                        dispatch({
                            type: "Username",
                            username: userName!
                        });
                        sessionStorage.setItem("uname", userName!);
                    } else {
                        // Invalid username - redirect to login with error
                        console.error("Username validation failed - no token received");
                        sessionStorage.setItem("loginError", "Invalid Username");
                        navigate("/backdoor");
                    }
                } catch {
                    // API error - redirect to login with error
                    console.error("Username validation failed");
                    sessionStorage.setItem("loginError", "Invalid Username");
                    navigate("/backdoor");
                } finally {
                    setIsValidating(false);
                }
            };

            validateUsername();
        }
    }, [dispatch, isValidating, navigate, userName, username]);

    /**
     * when username is validated, go to home
     */
    useEffect(() => {
        if (username) {
            navigate("/home");
        }
    }, [navigate, username]);

    return (
        <div>
            <h2>Welcome to the Load Tester - {isValidating ? "validating username..." : "setting values..."}</h2>
        </div>
    );
};

export default LoadTest;
