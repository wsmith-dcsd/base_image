import PropTypes from "prop-types";

import "../styles/ActionButton.scss";

/**
 * A button for performing various actions (submit, open, close, cancel, etc)
 * @name ActionButton
 * @param className
 * @param id
 * @param label
 * @param onClick
 * @return {JSX.Element}
 * @constructor
 */
const ActionButton = ({ className, id, label, onClick, onMouseEnter, onMouseLeave, type }) => {
    return (
        <button
            className={className}
            id={id}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            tabIndex={0}
            type={type}
        >
            {label}
        </button>
    );
};

ActionButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string
};

ActionButton.defaultProps = {
    className: "action-button-reg",
    onClick: null,
    onMouseEnter: null,
    onMouseLeave: null,
    id: "",
    label: "",
    type: "button"
};

export default ActionButton;
