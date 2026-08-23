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
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-semibold text-slate-900">Create an account</h1>
        <p className="mb-6 text-slate-600">Start managing your shortened URLs.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="register-username">Username</label>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900" id="register-username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="register-email">Email</label>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900" id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="register-password">Password</label>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900" id="register-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="register-confirm-password">Confirm password</label>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900" id="register-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600">Already have an account? <Link className="font-medium text-blue-600 hover:underline" to="/login">Log in</Link></p>
      </section>
    </main>
  );
}
