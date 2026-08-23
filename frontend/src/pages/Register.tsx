import { useState, type FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Unable to create your account. Please try again.";
  }

  return "Unable to create your account. Please try again.";
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100svh-5.75rem)] w-full max-w-xl items-center px-4 py-10 sm:px-6">
      <section className="w-full rounded-3xl border border-[#522B5B]/18 bg-[#FBE4D8]/70 p-6 text-left shadow-[0_20px_60px_rgba(43,18,76,0.13)] backdrop-blur-md sm:p-9">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-[#854F6C]/25 bg-[#DFB6B2]/35 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#522B5B] uppercase">Get started</span>
          <h1 className="mt-4 mb-2 text-3xl font-bold tracking-[-0.04em] text-[#190019] sm:text-4xl">Create an account</h1>
          <p className="text-sm text-[#522B5B] sm:text-base">Start managing your shortened URLs.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#522B5B]" htmlFor="register-username">Username</label>
            <input className="w-full rounded-xl border border-[#522B5B]/20 bg-[#FBE4D8]/75 px-3.5 py-3 text-sm text-[#190019] shadow-sm outline-none transition placeholder:text-[#854F6C]/60 focus:border-[#2B124C] focus:ring-3 focus:ring-[#2B124C]/12" id="register-username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#522B5B]" htmlFor="register-email">Email</label>
            <input className="w-full rounded-xl border border-[#522B5B]/20 bg-[#FBE4D8]/75 px-3.5 py-3 text-sm text-[#190019] shadow-sm outline-none transition placeholder:text-[#854F6C]/60 focus:border-[#2B124C] focus:ring-3 focus:ring-[#2B124C]/12" id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#522B5B]" htmlFor="register-password">Password</label>
            <input className="w-full rounded-xl border border-[#522B5B]/20 bg-[#FBE4D8]/75 px-3.5 py-3 text-sm text-[#190019] shadow-sm outline-none transition placeholder:text-[#854F6C]/60 focus:border-[#2B124C] focus:ring-3 focus:ring-[#2B124C]/12" id="register-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#522B5B]" htmlFor="register-confirm-password">Confirm password</label>
            <input className="w-full rounded-xl border border-[#522B5B]/20 bg-[#FBE4D8]/75 px-3.5 py-3 text-sm text-[#190019] shadow-sm outline-none transition placeholder:text-[#854F6C]/60 focus:border-[#2B124C] focus:ring-3 focus:ring-[#2B124C]/12" id="register-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </div>
          {error && <p className="rounded-xl border border-red-300/70 bg-red-50/70 px-3 py-2 text-sm text-red-800" role="alert">{error}</p>}
          <button className="w-full rounded-xl bg-[#2B124C] px-4 py-3 text-sm font-semibold text-[#FBE4D8] shadow-[0_7px_18px_rgba(43,18,76,0.23)] transition-all hover:-translate-y-px hover:bg-[#190019] hover:shadow-[0_10px_22px_rgba(43,18,76,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B124C] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Create account"}
          </button>
        </form>
        <p className="mt-7 text-center text-sm text-[#522B5B]">Already have an account? <Link className="font-semibold text-[#2B124C] underline decoration-[#854F6C]/45 underline-offset-4 transition-colors hover:text-[#854F6C]" to="/login">Log in</Link></p>
      </section>
    </main>
  );
}
