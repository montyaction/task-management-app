import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore.js";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RouteChangeHandler from "./components/RouteChangeHandler.jsx";
import AppLayout from "./components/AppLayout.jsx";

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return <p>Loading...</p>;   // Show a loading indicator while auth is being checked
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <>
      <RouteChangeHandler />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </>
  );
};
