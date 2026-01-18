const Main = (): React.JSX.Element => {
    return (
        <>
            <a href="#main-content" className="visually-hidden-focusable">
                Skip to main content
            </a>
            <main id="main-content" tabIndex={-1}>
                <h1>Welcome to the DCSD TypeScript Base Image</h1>
                <p>Use this code to build upon.</p>
            </main>
        </>
    );
};

export default Main;
