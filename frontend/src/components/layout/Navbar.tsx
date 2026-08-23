import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link className="font-semibold text-slate-900" to="/">URL Shortener</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link className="text-slate-700 hover:text-blue-600" to="/dashboard">Dashboard</Link>
            <button className="font-medium text-blue-600 hover:underline" type="button" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link className="text-slate-700 hover:text-blue-600" to="/login">Log in</Link>
            <Link className="font-medium text-blue-600 hover:underline" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
