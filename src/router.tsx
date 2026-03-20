import { lazy, type ReactNode, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { userRoutes } from "./user-routes";
import { PageTransition } from "./components/PageTransition";

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return <Suspense>{children}</Suspense>;
};

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SomethingWentWrongPage = lazy(
  () => import("./pages/SomethingWentWrongPage"),
);

const TransitionLayout = () => (
  <PageTransition>
    <Outlet />
  </PageTransition>
);

export const router = createBrowserRouter(
  [
    {
      element: <TransitionLayout />,
      children: [
        ...userRoutes,
        {
          path: "*",
          element: (
            <SuspenseWrapper>
              <NotFoundPage />
            </SuspenseWrapper>
          ),
          errorElement: (
            <SuspenseWrapper>
              <SomethingWentWrongPage />
            </SuspenseWrapper>
          ),
        },
      ],
    },
  ]
);