import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../Layout/Footer";
import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ UN SEUL login via api.login() (qui envoie maintenant du JSON)
      const loginData = await api.login(email, password);
      console.log("LOGIN RESPONSE:", loginData);

      // ✅ Récupérer le profil pour le rôle
      const profile = await api.getProfile();
      localStorage.setItem("role", profile.role);
      localStorage.setItem("is_admin", profile.role === "admin");
      console.log("✅ ROLE:", profile.role);

      // ✅ Rediriger SELON le rôle
      if (profile.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        const returnTo = searchParams.get("returnTo") || "/dashboard";
        navigate(returnTo, { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex justify-center items-center bg-gradient-to-b from-blue-400 to-white">
        <div className="bg-white p-8 rounded-xl shadow w-96">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

          {error && (
            <div className="bg-red-100 p-2 text-center text-red-600 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            No account? <Link to="/signup" className="text-blue-600 hover:underline">Register</Link>
          </p>
          <div className="flex items-center justify-between mt-4">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}