import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Layout/Footer";

const API = "http://127.0.0.1:8000/api";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
    goal: "seo"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          company: form.company,
          goal: form.goal
        })
      });

      const data = await res.json();
      console.log("REGISTER RESPONSE:", data);

      if (!res.ok) {
        setError(data.detail || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Account created successfully");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Server not responding");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex justify-center items-center bg-gradient-to-b from-blue-400 to-white">
        <div className="bg-white p-8 rounded-xl shadow w-96">

          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

          {error && <div className="bg-red-100 p-2 text-center text-red-600 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input name="fullName" placeholder="Full name" className="w-full border p-3 rounded" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" className="w-full border p-3 rounded" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" className="w-full border p-3 rounded" onChange={handleChange} required />
            <input name="company" placeholder="Company" className="w-full border p-3 rounded" onChange={handleChange} />

            <select name="goal" className="w-full border p-3 rounded" onChange={handleChange}>
              <option value="seo">SEO</option>
              <option value="analytics">Analytics</option>
              <option value="ai_insights">AI Insights</option>
            </select>

            <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded">
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p className="text-center mt-4 text-sm">
            Already have account? <Link to="/login" className="text-blue-600">Sign In</Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}