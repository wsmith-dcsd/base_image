import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "./contextProvider/ContextProvider";

/**
 * IMPORTANT - This is for Testing only - this component will only load when NODE_ENV !== "production"
 * Take a username to store in context and load home page
 * @name LoadTest
 * @constructor
 * @return {JSX.Element}
 */
const LoadTest = () => {
    const { userName } = useParams();

    const navigate = useNavigate();

    const { dispatch, state } = useGlobalContext();
    const { username } = state || {};

    /**
     * set username in context
     */
    useEffect(() => {
        if (userName && !username) {
            dispatch({
                type: "Username",
                username: userName
            });
            sessionStorage.setItem("uname", userName);
        }
    }, [dispatch, userName, username]);

    /**
     * when they are set go to the correct route
     */
    useEffect(() => {
        if (username) {
            navigate(`/home`);
        }
    }, [navigate, username]);

    return (
        <div>
            <h2>Welcome to the Load Tester - setting values...</h2>
        </div>
    );
};

export default LoadTest;
