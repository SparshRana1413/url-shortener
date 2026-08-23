import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="mx-4 mt-4 flex min-h-15 items-center justify-between rounded-2xl border border-[#522B5B]/18 bg-[#FBE4D8]/55 px-4 py-3 shadow-[0_10px_30px_rgba(25,0,25,0.07)] backdrop-blur-md sm:mx-7 sm:px-6">
      <Link
        aria-label="URL Shortener home"
        className="font-['Poppins',sans-serif] text-base font-bold tracking-[-0.03em] text-[#190019] transition-colors hover:text-[#854F6C] sm:text-lg"
        to="/"
      >
        URL Shortener
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {user ? (
          <>
            <span className="hidden max-w-48 truncate px-2 text-sm text-[#522B5B] lg:block">{user.email}</span>
            <Link
              aria-label="Open dashboard settings"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-transparent text-[#522B5B] transition-all hover:border-[#522B5B]/20 hover:bg-[#DFB6B2]/35 hover:text-[#190019] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B124C]"
              to="/dashboard"
            >
              <svg aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 4.32c.17-.75.83-1.32 1.7-1.32.86 0 1.53.57 1.7 1.32l.13.57c.1.42.38.77.76.96.38.19.82.2 1.2.03l.5-.22c.7-.31 1.52-.07 1.95.59.43.65.33 1.52-.23 2.07l-.4.39c-.3.29-.43.72-.35 1.13.08.41.36.76.75.95l.54.26c.71.34 1.06 1.14.84 1.89-.22.75-.95 1.25-1.73 1.18l-.57-.05c-.43-.04-.84.13-1.12.45-.28.32-.39.75-.29 1.16l.14.56c.19.76-.27 1.53-1.03 1.78-.76.24-1.58-.13-1.9-.85l-.24-.53a1.49 1.49 0 0 0-.96-.82 1.5 1.5 0 0 0-1.22.23l-.46.34a1.5 1.5 0 0 1-2.09-.24 1.5 1.5 0 0 1-.07-2.1l.38-.42c.28-.31.37-.75.24-1.15a1.5 1.5 0 0 0-.83-.91l-.53-.23a1.5 1.5 0 0 1-.85-1.89c.25-.76 1.02-1.22 1.78-1.03l.56.14c.41.1.84 0 1.16-.29.32-.28.49-.7.45-1.12l-.05-.57c-.07-.78.43-1.51 1.18-1.73Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
              </svg>
            </Link>
            <button className="rounded-xl px-3 py-2 text-sm font-medium text-[#522B5B] transition-all hover:bg-[#DFB6B2]/40 hover:text-[#190019] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B124C]" type="button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="rounded-xl px-3 py-2 text-sm font-medium text-[#522B5B] transition-all hover:bg-[#DFB6B2]/40 hover:text-[#190019] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B124C]" to="/login">Login</Link>
            <Link className="rounded-xl bg-[#2B124C] px-3.5 py-2 text-sm font-semibold text-[#FBE4D8] shadow-[0_5px_16px_rgba(43,18,76,0.2)] transition-all hover:-translate-y-px hover:bg-[#190019] hover:shadow-[0_8px_20px_rgba(43,18,76,0.26)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B124C]" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
