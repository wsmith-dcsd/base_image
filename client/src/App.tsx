import { Route, Routes } from "react-router-dom";

import LoadTest from "./components/LoadTest";
import Login from "./components/Login";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const App = (): React.JSX.Element => {
    const isDevelopment = process.env.NODE_ENV !== "production";

    return (
        <Routes>
            <Route path="/" element={<PrivateRoute />}>
                {/* Main Pages */}
                <Route index element={<Main />} />
                <Route path="home" element={<Main />} />
            </Route>
            {/* Public / Dev Routes */}
            {isDevelopment && (
                <>
                    <Route path="/backdoor" element={<Login />} />
                    <Route path="/loadtest/:userName" element={<LoadTest />} />
                    <Route path="/loadtest" element={<NotFound />} />
                </>
            )}
            <Route path="/notFound" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
