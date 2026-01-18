import ActionButton from "./ActionButton";
import DcsdDialog from "./DcsdDialog";

/**
 * @todo Need to switch out this for a different bootstrap dialog
 * @returns a simple looking dialog to tell the user they dont have access to this page
 */
const NotFound = (): React.JSX.Element => {
    return (
        <DcsdDialog
            actions={
                <a
                    href="https://employee.dcsdk12.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(): void => {
                        // Fallback if the external link fails
                        setTimeout((): void => {
                            if (document.visibilityState === "visible") {
                                window.location.href = "/";
                            }
                        }, 1000);
                    }}
                >
                    <ActionButton
                        ariaLabel="Back to DCSD Home"
                        className="action-button-reg"
                        label="Back to DCSD Home"
                    ></ActionButton>
                </a>
            }
            ariaLabel="Not Found"
            hasCloseX={false}
            id="page-not-found"
            open="page-not-found"
            title="Page Not Found"
        >
            <div>
                This application is not available based on the URL you entered <b>OR</b> your current position <b>OR</b>{" "}
                your current location.
            </div>
        </DcsdDialog>
    );
};

export default NotFound;
