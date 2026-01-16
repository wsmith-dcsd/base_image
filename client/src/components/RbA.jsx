import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import LoadingSvg from "../loadingSvg/LoadingSvg";
import UserDetails from "../../utils/UserDetails";

/**
 * Role-based Authentication Component.
 * Checks against the GlobalContext UserDetails to authorize access.
 *
 * @param {string[]} allowedRoles - Array of role strings permitted to view children
 * @param {node} children - The protected content
 * @param {string} redirect - Path to redirect to if unauthorized
 * @returns {node}
 */
const RbA = ({ allowedRoles, children, redirect }) => {
    const userDetails = UserDetails();

    // 1. Derive authorization state directly (no useEffect or useState needed)
    const isAuthorized = useMemo(() => {
        // If data isn't loaded yet, we can't authorize
        if (!userDetails || !userDetails.roleDtos) {
            return false;
        }

        // Extract role strings from the DTO objects
        const userRoles = userDetails.roleDtos.map((dto) => dto.role);

        // Check if ANY of the allowedRoles exist in the userRoles
        return allowedRoles.some((role) => userRoles.includes(role));
    }, [userDetails, allowedRoles]);

    // 2. Handle Loading State
    // Assuming UserDetails returns null/undefined while fetching
    if (!userDetails) {
        return <LoadingSvg />;
    }

    // 3. Handle Access
    if (isAuthorized) {
        // React 18+ allows returning children directly, but fragments are safer for some generic types
        return <>{children}</>;
    }

    // 4. Handle Unauthorized (Redirect)
    // The 'replace' prop prevents the user from clicking "Back" into a forbidden page
    return <Navigate to={redirect} replace />;
};

RbA.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node,
    redirect: PropTypes.string
};

RbA.defaultProps = {
    children: null,
    redirect: "/" // Default to root if no redirect provided, prevents loops on empty strings
};

export default RbA;