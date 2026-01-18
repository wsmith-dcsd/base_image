import { createProxyMiddleware } from "http-proxy-middleware";
import { Application } from "express";

module.exports = function (app: Application): void {
    app.use(
        "/**",
        createProxyMiddleware({
            target: "http://localhost:8080",
            secure: true,
            changeOrigin: true
        })
    );
};
