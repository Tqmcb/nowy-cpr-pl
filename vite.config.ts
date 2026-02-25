import react from "@vitejs/plugin-react";
import "dotenv/config";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import injectHTML from "vite-plugin-html-inject";
import tsConfigPaths from "vite-tsconfig-paths";

const buildVariables = () => {
	const appId = process.env.DATABUTTON_PROJECT_ID;

	const defines: Record<string, string> = {
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
	};

	return defines;
};

// https://vite.dev/config/
export default defineConfig({
	define: {
		...buildVariables(),
		// Polyfill untuk gray-matter dalam przeglądarce
		global: 'globalThis',
	},
	plugins: [react(), splitVendorChunkPlugin(), tsConfigPaths(), injectHTML()],
	server: {
		host: '127.0.0.1',
		proxy: {
			"/routes": {
				target: "http://127.0.0.1:8000",
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: [
			{ find: "@/components/ui", replacement: path.resolve(__dirname, "./src/extensions/shadcn/components") },
			{ find: "@", replacement: path.resolve(__dirname, "./src") },
			// Buffer polyfill for gray-matter
			{ find: "buffer", replacement: "buffer/" },
		],
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis',
			},
		},
	},
});
