import { useState } from "react";
import { verifyResetCode } from "../../services/authApi";
import { Loader, AlertCircle, KeyRound } from "lucide-react";

export default function VerifyCode({ email, onVerified }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyResetCode(email, code);
      onVerified(code); // Pass code to parent for step 3
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-7 h-7 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Verify Code</h2>
        <p className="text-gray-500 text-sm mt-2">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="w-full border rounded-xl py-3 px-4 text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 outline-none"
          required
          maxLength={6}
        />
        
        <button
          disabled={loading || code.length !== 6}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Verify Code"}
        </button>
      </form>
    </div>
  );
}