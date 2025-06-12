import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), checker({ typescript: true })],
    server: {
        proxy: {
            // Forward all requests from localhost:5173/api/* to localhost:3000/api/*
            "/api": {
                target: "http://localhost:3000",
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                    console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                    console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                    console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            },
            "/auth": {
                target: "http://localhost:3000",
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                    console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                    console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                    console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            },
        }
    },
});
