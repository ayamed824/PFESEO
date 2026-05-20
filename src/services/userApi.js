const API_URL = 'http://localhost:8000/api/users';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

export const getProfile = async () => {
  const res = await fetch(`${API_URL}/me`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateProfile = async (data) => {
  const res = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const changePassword = async (current_password, new_password) => {
  const res = await fetch(`${API_URL}/me/change-password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ current_password, new_password })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};