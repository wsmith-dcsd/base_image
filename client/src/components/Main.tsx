const Main = (): React.JSX.Element => {
    return (
        <>
            <a href="#main-content" className="visually-hidden-focusable">
                Skip to main content
            </a>
            <main id="main-content" tabIndex={-1}>
                <h1>Welcome to the DCSD Professional Development Page</h1>
                <p>Access professional development resources and tools.</p>
            </main>
        </>
    );
};

export default Main;
