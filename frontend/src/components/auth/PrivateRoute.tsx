import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children }: PropsWithChildren) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center" role="status">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
