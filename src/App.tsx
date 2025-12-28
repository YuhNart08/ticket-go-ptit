import { Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes/routes";
import type { ComponentType, PropsWithChildren } from "react";
import DefaultLayout from "./components/Layouts/Client/DefaultLayout/DefaultLayout";
import { Fragment } from "react";
import { Toaster } from "sonner";
// @ts-expect-error - JSX file without type declarations
import { AuthProvider } from "./contexts/AuthContext.jsx";
// @ts-expect-error - JSX file without type declarations
import LayoutAdmin from "./components/Layouts/admin/LayoutAdmin";
// @ts-expect-error - JSX file without type declarations
import ProtectedRoute from "./components/Layouts/admin/components/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {publicRoutes.map((route, index) => {
          let Layout: ComponentType<PropsWithChildren> = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        {privateRoutes.map((route, index) => {
          let Layout: ComponentType<PropsWithChildren> = LayoutAdmin;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          const Page = route.component;
          return (
            <Route
              key={`private-${index}`}
              path={route.path}
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <Page />
                  </Layout>
                </ProtectedRoute>
              }
            />
          );
        })}
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
