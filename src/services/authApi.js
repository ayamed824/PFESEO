const API = "http://localhost:8000/api/auth";;

const headers = () => ({
  "Content-Type": "application/json",
});

export const forgotPassword = async (email) => {
  try {
    const res = await fetch(`${API}/forgot-password`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email }),
    });

    const text = await res.text();

    console.log("STATUS:", res.status);
    console.log("RAW RESPONSE:", text);

    let data = {};

    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }

    if (!res.ok) {
      throw new Error(data.detail || "Failed to send reset email");
    }

    return data;

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    throw err;
  }
};

export const verifyResetToken = async (token) => {
  const res = await fetch(`${API}/verify-reset-token/${token}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Invalid token");
  return data;
};

export const resetPassword = async (token, new_password) => {
  const res = await fetch(`${API}/reset-password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ token, new_password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to reset password");
  return data;
};