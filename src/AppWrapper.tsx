import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Head } from "./internal-components/Head";
import { ThemeProvider } from "./internal-components/ThemeProvider";
import { DEFAULT_THEME } from "./constants/default-theme";
import { CookieConsent } from "./components/CookieConsent";

function isChunkLoadError(error: Error): boolean {
	return (
		error.name === "ChunkLoadError" ||
		/Loading chunk [\d]+ failed/.test(error.message) ||
		/Failed to fetch dynamically imported module/.test(error.message) ||
		/Importing a module script failed/.test(error.message)
	);
}

export const AppWrapper = () => {
	return (
		<ThemeProvider defaultTheme={DEFAULT_THEME}>
			<ErrorBoundary
				fallback={null}
				onError={(error) => {
					if (isChunkLoadError(error)) {
						// Stale chunk after a new deployment — force reload to get fresh assets
						window.location.reload();
						return;
					}
					console.error(
						"Caught error in AppWrapper",
						error.message,
						error.stack,
					);
				}}
			>
				<Suspense fallback={null}>
					<RouterProvider router={router} />
				</Suspense>
				<Head />
				<CookieConsent />
			</ErrorBoundary>
		</ThemeProvider>
	);
};
