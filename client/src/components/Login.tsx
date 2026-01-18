import { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActionButton from "./ActionButton";
import FormReducer from "../utils/FormReducer";

const styles = {
    container: {
        display: "flex" as const,
        justifyContent: "center" as const,
        width: "80%",
        margin: "0 auto",
        background: "#D3D3D3"
    },
    content: {
        width: "100%",
        margin: "0 auto",
        marginBottom: "50px",
        marginTop: "50px",
        textAlign: "center" as const
    },
    inputContainer: {
        marginTop: "50px",
        width: "100%"
    }
};

const Login = (): React.JSX.Element => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Check for error message from sessionStorage on mount
    useEffect(() => {
        const error = sessionStorage.getItem("loginError");
        if (error) {
            setErrorMessage(error);
            sessionStorage.removeItem("loginError");
        }
    }, []);

    const initialFormState = {
        username: ""
    };

    const [formState, formDispatch] = useReducer(FormReducer, initialFormState);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        formDispatch({
            type: "text",
            field: name,
            payload: value
        });
    };

    const handleSubmit = (e?: React.FormEvent): void => {
        e?.preventDefault();
        const { username } = formState;
        if (typeof username === "string" && username.trim().length) {
            setErrorMessage(null); // Clear any previous errors
            sessionStorage.clear();
            sessionStorage.setItem("devLogin", "devLogin");
            navigate(`/loadtest/${username.trim()}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <header>
                    <h1>
                        Welcome to DCSD TypeScript Base Image <u>Backdoor!</u>
                    </h1>
                </header>
                <main>
                    <p>Please Log In Below</p>
                    {errorMessage && (
                        <div style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}>{errorMessage}</div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={styles.inputContainer}>
                            <label htmlFor="username">
                                Username:
                                <input
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    onChange={handleOnChange}
                                    onKeyDown={handleKeyDown}
                                    type="text"
                                    required
                                    aria-describedby="username-help"
                                    autoComplete="username"
                                />
                            </label>
                            <div id="username-help" className="visually-hidden">
                                Enter your username to access the development environment
                            </div>
                        </div>
                        <div className="m-5" />
                        <ActionButton
                            ariaLabel="Log In to Development Environment"
                            label="Log In"
                            onClick={handleSubmit}
                            type="submit"
                        />
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Login;
