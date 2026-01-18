import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import LoadingSvg from "./LoadingSvg";
import UserDetails from "../utils/UserDetails";

/**
 * Role-based Authentication Component.
 * Checks against the GlobalContext UserDetails to authorize access.
 *
 * @param {string[]} allowedRoles - Array of role strings permitted to view children
 * @param {node} children - The protected content
 * @param {string} redirect - Path to redirect to if unauthorized
 * @returns {node}
 */
interface RbAProps {
    allowedRoles: string[];
    children?: React.ReactNode;
    redirect?: string;
}

const RbA = ({ allowedRoles, children, redirect = "/" }: RbAProps): React.ReactNode => {
    const userDetails = UserDetails();

    // 1. Derive authorization state directly (no useEffect or useState needed)
    const isAuthorized = useMemo((): boolean => {
        // If data isn't loaded yet, we can't authorize
        if (!userDetails || typeof userDetails !== "object" || !("roleDtos" in userDetails)) {
            return false;
        }

        const userDetailsObj = userDetails as { roleDtos: { role: string }[] };

        // Extract role strings from the DTO objects
        const userRoles = userDetailsObj.roleDtos.map((dto: { role: string }): string => dto.role);

        // Check if ANY of the allowedRoles exist in the userRoles
        return allowedRoles.some((role): boolean => userRoles.includes(role));
    }, [userDetails, allowedRoles]);

    // 2. Handle Loading State
    if (!userDetails) {
        return (
            <div role="status" aria-live="polite">
                <LoadingSvg message="Checking permissions..." />
            </div>
        );
    }

    // 3. Handle Access
    if (isAuthorized) {
        return children;
    }

    // 4. Handle Unauthorized (Redirect)
    // Announce to screen readers before redirect
    return (
        <div role="alert" aria-live="assertive">
            <p className="visually-hidden">Access denied. Redirecting...</p>
            <Navigate to={redirect} replace />
        </div>
    );
};

export default RbA;
