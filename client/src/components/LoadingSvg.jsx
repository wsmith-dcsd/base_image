import React from "react";
import PropTypes from "prop-types";

const LoadingSvg = ({ message, fullScreen }) => {
    // Style wrapper based on whether we want a full-screen overlay or an inline loader
    const containerStyle = fullScreen
        ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Slight white overlay
              zIndex: 9999
          }
        : {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "2rem"
          };

    return (
        <div style={containerStyle} data-testid="loading-spinner">
            <svg
                width="80px"
                height="80px"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outer Ring */}
                <circle
                    cx="50"
                    cy="50"
                    r="32"
                    strokeWidth="8"
                    stroke="#e0e0e0" // Light gray track
                    strokeDasharray="50.26548245743669 50.26548245743669"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Rotating Spinner */}
                <circle
                    cx="50"
                    cy="50"
                    r="32"
                    strokeWidth="8"
                    stroke="#0d6efd" // Bootstrap Primary Blue
                    strokeDasharray="50.26548245743669 50.26548245743669"
                    strokeDashoffset="50.26548245743669"
                    fill="none"
                    strokeLinecap="round"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1s"
                        keyTimes="0;1"
                        values="0 50 50;360 50 50"
                    />
                </circle>
            </svg>

            {message && <div className="mt-3 text-muted fw-bold">{message}</div>}
        </div>
    );
};

LoadingSvg.propTypes = {
    message: PropTypes.string,
    fullScreen: PropTypes.bool
};

LoadingSvg.defaultProps = {
    message: null,
    fullScreen: false
};

export default LoadingSvg;
