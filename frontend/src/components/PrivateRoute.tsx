import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  // 1. Show a loading spinner while rehydrating auth state from localStorage
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
        <span>Loading...</span>
      </div>
    );
  }

  // 2. Redirect to /login if unauthenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Render children if authenticated
  return <>{children}</>;
}