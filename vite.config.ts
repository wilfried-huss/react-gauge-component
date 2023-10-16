/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";


const VITE_PREVIEW_PORT = parseInt(process.env.VITE_PREVIEW_PORT ?? "4137");


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts(), react()],
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/lib/index.ts'),
        name: 'React Gauge Component',
        // the proper extensions will be added
        fileName: 'react_gauge_component',
      },
      sourcemap: true,
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['react', 'react-dom', 'react/jsx-runtime', 'd3', 'lodash'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
            d3: 'D3',
            lodash: 'lodash'
          },
        },
      },
    },
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
});
