import Modal from "react-bootstrap/Modal";

import "../styles/DcsdModalStyling.scss";

interface DcsdDialogProps {
    actions?: React.ReactNode;
    ariaLabel: string;
    children?: React.ReactNode;
    hasCloseX?: boolean;
    id?: string;
    onHide?: () => void;
    open?: string;
    title?: string | React.ReactNode;
}

/**
 * A Basic Dialog
 */
const DcsdDialog = ({
    actions,
    ariaLabel,
    children,
    hasCloseX = true,
    id,
    onHide,
    open,
    title
}: DcsdDialogProps): React.JSX.Element => {
    const titleId = id ? `${id}-title` : "dialog-title";
    const descriptionId = id ? `${id}-description` : "dialog-description";

    return (
        <Modal
            aria-label={ariaLabel || ""}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            backdrop="static"
            centered
            id={id}
            scrollable
            onHide={onHide}
            role="dialog"
            show={!!(open && id && open === id)}
            size="xl"
            aria-modal="true"
        >
            <div className="outer-container">
                <Modal.Header closeButton={hasCloseX}>
                    <div className="text-color">
                        <Modal.Title id={titleId}>{title}</Modal.Title>
                    </div>
                </Modal.Header>
                <div className="text-color body">
                    <Modal.Body id={descriptionId}>{children}</Modal.Body>
                </div>
                <Modal.Footer>{actions}</Modal.Footer>
            </div>
        </Modal>
    );
};

export default DcsdDialog;
