import { createContext, useContext, useMemo, useReducer } from "react";

interface GlobalAction {
    type: string;
    allLocationDtos?: unknown[];
    locKey?: unknown;
    schoolYearDto?: unknown;
    token?: string;
    userDetails?: unknown;
    username?: string;
}

interface GlobalState {
    allLocationDtos: unknown[];
    locKey: unknown;
    schoolYearDto: unknown;
    token: string | null;
    userDetails: unknown;
    username: string | null;
}

const initialState: GlobalState = {
    allLocationDtos: [],
    locKey: null,
    schoolYearDto: null,
    token: null,
    userDetails: null,
    username: null
};

/**
 * Reducer function to handle state updates.
 */
const reducer = (state: GlobalState, action: GlobalAction): GlobalState => {
    switch (action.type) {
        case "AllLocationDtos":
            return {
                ...state,
                allLocationDtos: action.allLocationDtos || []
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
                token: action.token || null
            };
        case "UserDetails":
            return {
                ...state,
                userDetails: action.userDetails
            };
        case "Username":
            return {
                ...state,
                username: action.username || null
            };
        case "Reset":
            return initialState;
        default:
            return state;
    }
};

// Create Context
interface GlobalContextType {
    state: GlobalState;
    dispatch: React.Dispatch<GlobalAction>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/**
 * Context Provider Component.
 * Wraps the application and provides global state management.
 *
 * @param {node} children
 * @param {string} initialToken - Token passed from PrivateRoute to hydrate state immediately
 * @param {string} initialUsername - Username passed from PrivateRoute to hydrate state immediately
 */
const ContextProvider = ({
    children,
    initialToken,
    initialUsername
}: {
    children: React.ReactNode;
    initialToken?: string | null;
    initialUsername?: string | null;
}): React.JSX.Element => {
    /**
     * Hydrate state immediately with BOTH token and username.
     * This ensures hooks like UserDetails fire on the very first render.
     */
    const init = (defaultState: GlobalState): GlobalState => {
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

    const contextValue = useMemo((): GlobalContextType => {
        return { state, dispatch };
    }, [state]);

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

/**
 * Custom Hook for consuming Global Context.
 * Usage: const { state, dispatch } = useGlobalContext();
 *
 * @returns {object} { state, dispatch }
 */
const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);

    // Safety Check: Ensure this is used within the provider
    if (context === undefined) {
        throw new Error("useGlobalContext must be used within a ContextProvider");
    }

    return context;
};

// Export the Provider and the Custom Hook
export { ContextProvider, useGlobalContext };
