import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
    plugins: [preact({ devtoolsInProd: true })],
    server: {
        port: 3680,
    },
});