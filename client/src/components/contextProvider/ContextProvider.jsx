import { createContext, useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";

// 1. Define the default state shape
const initialState = {
    allLocationDtos: [],
    locKey: null,
    schoolYearDto: null,
    token: null,
    userDetails: null,
    username: null
};

/**
 * Reducer function to handle state updates.
 *
 * @param {object} state - Current state
 * @param {object} action - Action to perform
 * @returns {object} New state
 */
const reducer = (state, action) => {
    switch (action.type) {
        case "AllLocationDtos":
            return {
                ...state,
                allLocationDtos: action.allLocationDtos
            };
        case "LocKey":
            return {
                ...state,
                locKey: action.locKey
            };
        case "SchoolYearDto":
            return {
                ...state,
                schoolYearDto: action.schoolYearDto
            };
        case "Token":
            return {
                ...state,
                token: action.token
            };
        case "UserDetails":
            return {
                ...state,
                userDetails: action.userDetails
            };
        case "Username":
            return {
                ...state,
                username: action.username
            };
        case "Reset":
            return initialState;
        default:
            return state;
    }
};

// Create Context
const GlobalContext = createContext(initialState);

/**
 * Context Provider Component.
 * Wraps the application and provides global state management.
 *
 * @param {node} children
 * @param {string} initialToken - Token passed from PrivateRoute to hydrate state immediately
 * @param {string} initialUsername - Username passed from PrivateRoute to hydrate state immediately
 */
const ContextProvider = ({ children, initialToken, initialUsername }) => {
    /**
     * Hydrate state immediately with BOTH token and username.
     * This ensures hooks like UserDetails fire on the very first render.
     */
    const init = (defaultState) => {
        if (initialToken || initialUsername) {
            return {
                ...defaultState,
                token: initialToken || defaultState.token,
                username: initialUsername || defaultState.username
            };
        }
        return defaultState;
    };

    const [state, dispatch] = useReducer(reducer, initialState, init);

    const contextValue = useMemo(() => {
        return { state, dispatch };
    }, [state]);

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

ContextProvider.propTypes = {
    children: PropTypes.node,
    initialToken: PropTypes.string,
    initialUsername: PropTypes.string // Add this new prop type
};

ContextProvider.defaultProps = {
    children: null,
    initialToken: null,
    initialUsername: null
};

/**
 * Custom Hook for consuming Global Context.
 * Usage: const { state, dispatch } = useGlobalContext();
 *
 * @returns {object} { state, dispatch }
 */
const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    // Safety Check: Ensure this is used within the provider
    if (context === undefined) {
        throw new Error("useGlobalContext must be used within a ContextProvider");
    }

    return context;
};

// Export the Provider and the Custom Hook
export { ContextProvider, useGlobalContext };
