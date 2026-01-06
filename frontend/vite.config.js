import react from "@vitejs/plugin-react";
import "dotenv/config";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import injectHTML from "vite-plugin-html-inject";
import tsConfigPaths from "vite-tsconfig-paths";
var ExtensionName;
(function (ExtensionName) {
    ExtensionName["FIREBASE_AUTH"] = "firebase-auth";
})(ExtensionName || (ExtensionName = {}));
const listExtensions = () => {
    if (process.env.DATABUTTON_EXTENSIONS) {
        try {
            return JSON.parse(process.env.DATABUTTON_EXTENSIONS);
        }
        catch (err) {
            console.error("Error parsing DATABUTTON_EXTENSIONS", err);
            console.error(process.env.DATABUTTON_EXTENSIONS);
            return [];
        }
    }
    return [];
};
const extensions = listExtensions();
const getExtensionConfig = (name) => {
    const extension = extensions.find((it) => it.name === name);
    if (!extension) {
        console.warn(`Extension ${name} not found`);
    }
    return JSON.stringify(extension?.config);
};
const buildVariables = () => {
    const appId = process.env.DATABUTTON_PROJECT_ID;
    const defines = {
        __APP_ID__: JSON.stringify(appId),
        __API_PATH__: JSON.stringify(""),
        __API_URL__: JSON.stringify(process.env.VITE_API_URL || "http://localhost:8000"),
        __WS_API_URL__: JSON.stringify("ws://localhost:8000"),
        __APP_BASE_PATH__: JSON.stringify("/"),
        __APP_TITLE__: JSON.stringify("Databutton"),
        __APP_FAVICON_LIGHT__: JSON.stringify("/favicon-light.svg"),
        __APP_FAVICON_DARK__: JSON.stringify("/favicon-dark.svg"),
        __APP_DEPLOY_USERNAME__: JSON.stringify(""),
        __APP_DEPLOY_APPNAME__: JSON.stringify(""),
        __APP_DEPLOY_CUSTOM_DOMAIN__: JSON.stringify(""),
        __FIREBASE_CONFIG__: JSON.stringify(getExtensionConfig(ExtensionName.FIREBASE_AUTH)),
    };
    return defines;
};
// https://vite.dev/config/
export default defineConfig({
    define: buildVariables(),
    plugins: [react(), splitVendorChunkPlugin(), tsConfigPaths(), injectHTML()],
    server: {
        proxy: {
            "/routes": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
