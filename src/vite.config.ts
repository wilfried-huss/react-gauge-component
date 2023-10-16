/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const DOLOMITE_PORT = process.env.DOLOMITE_PORT ?? 3001;
const DOLOMITE_URL = `http://localhost:${DOLOMITE_PORT}`;

const CAMERA_PORT = process.env.CAMERA_PORT ?? 3002;
const CAMERA_URL = `http://localhost:${CAMERA_PORT}`;

const SERLES_SYSTEM_PORT = process.env.SERLES_SYSTEM_PORT ?? 8000;
const SERLES_SYSTEM_URL = `http://localhost:${SERLES_SYSTEM_PORT}`;

const PROCESS_COMPOSE_URL = "http://localhost:8080";

const VITE_PREVIEW_PORT = parseInt(process.env.VITE_PREVIEW_PORT ?? "4137");

/** Add proxy routes for process-compose.
 *
 * If the environment variable NO_PROCESS_COMPOSE is set
 * no proxy configuration for the process compose routes
 * are defined.
 *
 * This prevents the vite preview server from showing errors
 * in frontend tests where it is started by a pytest fixture
 * and no process-compose API is available.
 */
const processComposeProxy = () => {
    if (process.env.NO_PROCESS_COMPOSE) {
        return {};
    }
    return {
        "/process": {
            target: PROCESS_COMPOSE_URL,
            changeOrigin: true,
        },
        "/processes": {
            target: PROCESS_COMPOSE_URL,
            changeOrigin: true,
        },
        "/process/logs/ws": {
            target: PROCESS_COMPOSE_URL,
            ws: true,
        },
        "/swagger": {
            target: PROCESS_COMPOSE_URL,
            changeOrigin: true,
        },
    };
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    preview: {
        port: VITE_PREVIEW_PORT,
    },
    server: {
        proxy: {
            // Using the proxy instance
            "/api": {
                target: SERLES_SYSTEM_URL,
                changeOrigin: true,
            },
            "/camera": {
                target: CAMERA_URL,
                changeOrigin: true,
            },
            "/dolomite": {
                target: DOLOMITE_URL,
                changeOrigin: true,
            },
            "/docs/camera": {
                target: CAMERA_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/docs\/camera/, ""),
            },
            "/docs/system": {
                target: SERLES_SYSTEM_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/docs\/system/, ""),
            },
            ...processComposeProxy(),
        },
    },
    assetsInclude: ["**/*.md"],
    test: {
        globals: true,
        environment: "jsdom",
        coverage: {
            all: true,
            provider: "istanbul",
            reporter: ["text", "html"],
        },
        includeSource: ["src/**/*.ts"],
    },
    define: {
        // Strip in-source tests from production build
        "import.meta.vitest": "undefined",
    },
    build: {
        sourcemap: true,
    },
});
