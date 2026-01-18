import "../styles/ActionButton.scss";

interface ActionButtonProps {
    ariaLabel?: string;
    className?: string;
    id?: string;
    label?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    type?: "button" | "submit" | "reset";
}

/**
 * A button for performing various actions (submit, open, close, cancel, etc)
 */
const ActionButton = ({
    ariaLabel,
    className = "action-button-reg",
    id = "",
    label = "",
    onClick,
    onMouseEnter,
    onMouseLeave,
    type = "button"
}: ActionButtonProps): React.JSX.Element => {
    return (
        <button
            aria-label={ariaLabel || label}
            className={className}
            id={id}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            type={type}
        >
            {label}
        </button>
    );
};

export default ActionButton;
