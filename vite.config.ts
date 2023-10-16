/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


const VITE_PREVIEW_PORT = parseInt(process.env.VITE_PREVIEW_PORT ?? "4137");


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    preview: {
        port: VITE_PREVIEW_PORT,
    },
    assetsInclude: ["**/*.md"],
    test: {
        globals: true,
        environment: "jsdom",
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
