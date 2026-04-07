import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Layout/Footer";

const API = "http://127.0.0.1:8000/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ IMPORTANT: Backend attend du JSON (UserLogin Pydantic), PAS du form-data
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // ← JSON, pas form-data !
        },
        body: JSON.stringify({ 
          email,    // ← "email", pas "username"
          password 
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        // ✅ Gérer les erreurs 422 (validation) et 401 (auth)
        if (Array.isArray(data.detail)) {
          // Erreurs de validation FastAPI: [{loc, msg, type...}, ...]
          const messages = data.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
          setError(messages);
        } else if (typeof data.detail === 'object') {
          setError(JSON.stringify(data.detail));
        } else {
          setError(String(data.detail || "Login failed"));
        }
        setLoading(false);
        return;
      }

      // ✅ Sauvegarder le token
      localStorage.setItem("token", data.access_token);
      console.log("✅ TOKEN SAVED:", data.access_token.substring(0, 50) + "...");

      // ✅ Rediriger
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError("Server not responding. Is backend running?");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex justify-center items-center bg-gradient-to-b from-blue-400 to-white">
        <div className="bg-white p-8 rounded-xl shadow w-96">

          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

          {/* ✅ Afficher l'erreur (convertie en string si objet) */}
          {error && (
            <div className="bg-red-100 p-2 text-center text-red-600 mb-4 text-sm">
              {typeof error === 'object' ? JSON.stringify(error) : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
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
            No account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}