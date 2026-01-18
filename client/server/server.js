const express = require("express");
const path = require("path");

const app = express();

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 8080;

const staticDir = process.env.STATIC_DIR || (process.env.PWD === "/usr/src/app" ? "./public" : "../public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allowed-Methods", "DELETE, GET, OPTIONS, POST, PUT");
        next();
    } catch (err) {
        next(err);
    }
});
app.use("/", express.static(path.join(__dirname, staticDir)));

// Error handling middleware
app.use((err, req, res) => {
    /* eslint-disable no-console */
    console.error("Server error:", err.stack);
    /* eslint-enable no-console */
    res.status(500).json({ error: "Internal server error" });
});

/**
 * GET (Request) listener
 */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, staticDir, "./index.html"));
});
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, staticDir, "./index.html"));
});
app.get("/notFound", (req, res) => {
    res.sendFile(path.join(__dirname, staticDir, "./index.html"));
});
/* Dev only */
app.get("/backdoor", (req, res) => {
    res.sendFile(path.join(__dirname, staticDir, "./index.html"));
});

app.listen(PORT, HOST, () => {
    /* eslint-disable no-console */
    console.info(`Server ${HOST} is listening on this port: ${PORT}`);
    console.info("static is here: ", path.join(__dirname, staticDir));
    /* eslint-enable no-console */
});
