import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";

import "../styles/DcsdModalStyling.scss";

/**
 * A Basic Dialog
 * @name DcsdDialog
 * @param {node} actions
 * @param {string} ariaLabel
 * @param {node} children
 * @param {bool} hasCloseX
 * @param {string} id
 * @param {func} onHide
 * @param {string} open
 * @param {string} title
 * @constructor
 * @return {JSX.Element}
 */
const DcsdDialog = ({ actions, ariaLabel, children, hasCloseX, id, onHide, open, title }) => {
    return (
        <Modal
            aria-label={ariaLabel}
            backdrop="static" // this "static" is so dialog will NOT close if outside click
            centered // this puts the Modal in the center of the page (up/down)
            id={title}
            scrollable
            onHide={onHide}
            role="dialog"
            show={open === id}
            size="xl"
            title={typeof title === "string" ? title : ariaLabel}
        >
            <div className="outer-container">
                {/* "closeButton" is the property passed into the header to enable "X" at top of modal to close*/}
                <Modal.Header closeButton={hasCloseX}>
                    {" "}
                    <div className="text-color">
                        <Modal.Title>{title}</Modal.Title>
                    </div>
                </Modal.Header>
                <div className="text-color body">
                    <Modal.Body>{children}</Modal.Body>
                </div>
                <Modal.Footer>{actions}</Modal.Footer>
            </div>
        </Modal>
    );
};

DcsdDialog.propTypes = {
    actions: PropTypes.node,
    ariaLabel: PropTypes.string.isRequired,
    children: PropTypes.node,
    hasCloseX: PropTypes.bool,
    id: PropTypes.string,
    onHide: PropTypes.func,
    open: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

DcsdDialog.defaultProps = {
    actions: null,
    children: null,
    hasCloseX: true,
    id: null,
    onHide: null,
    open: null,
    title: null
};

export default DcsdDialog;
