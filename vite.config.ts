import react from "@vitejs/plugin-react";
import "dotenv/config";
import path from "node:path";
import { defineConfig } from "vite";
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
	plugins: [react(), tsConfigPaths(), injectHTML()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) return;
					// Markdown stack — only loaded on blog post / wyrob detail pages
					if (
						id.includes('/react-markdown/') ||
						id.includes('/remark-') ||
						id.includes('/rehype-') ||
						id.includes('/unified/') ||
						id.includes('/micromark') ||
						id.includes('/mdast-') ||
						id.includes('/hast-') ||
						id.includes('/vfile') ||
						id.includes('/unist-') ||
						id.includes('/decode-named-character-reference') ||
						id.includes('/character-entities') ||
						id.includes('/lowlight') ||
						id.includes('/highlight.js') ||
						id.includes('/fault/')
					) {
						return 'markdown-vendor';
					}
					// React core — changes rarely, strong cache hit
					if (
						id.includes('/react/') ||
						id.includes('/react-dom/') ||
						id.includes('/react-router') ||
						id.includes('/scheduler/')
					) {
						return 'react-vendor';
					}
					// Radix UI components
					if (id.includes('@radix-ui/')) {
						return 'radix-vendor';
					}
					// Everything else
					return 'vendor';
				},
			},
		},
	},
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
