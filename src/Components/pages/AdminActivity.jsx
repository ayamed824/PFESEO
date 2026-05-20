import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { api } from "../../services/api";

const AdminActivity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getAdminActivity();
      setUsers(data.users || []);
      setReports(data.reports || []);
    } catch (err) {
      setError(err.message || "Failed to load admin activity");
      if (err.message?.includes("401")) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8">Loading admin activity...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Activity</h1>
            <p className="text-gray-600 mt-1">Monitor users, analyzed URLs, and generated reports.</p>
          </div>
          <button onClick={fetchActivity} className="px-4 py-2 bg-primary text-white rounded-lg">
            Refresh
          </button>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500">Users</div>
            <div className="text-3xl font-bold">{users.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500">Reports</div>
            <div className="text-3xl font-bold">{reports.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500">Enterprise/Admin Users</div>
            <div className="text-3xl font-bold">{users.filter((user) => user.plan === "enterprise").length}</div>
          </div>
        </div>

        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">User Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="p-4">
                      <div className="font-semibold">{user.full_name || "Unnamed"}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </td>
                    <td className="p-4">{user.company || "-"}</td>
                    <td className="p-4 capitalize">{user.plan}</td>
                    <td className="p-4">{user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</td>
                    <td className="p-4">{user.is_active ? "Active" : "Disabled"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recent Research & Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">URL</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Issues</th>
                  <th className="p-4">Recommendations</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="p-4 font-medium">{report.url}</td>
                    <td className="p-4">{report.global_score}/100</td>
                    <td className="p-4">{report.issues?.length || 0}</td>
                    <td className="p-4">{report.recommendations?.length || 0}</td>
                    <td className="p-4">{report.created_at ? new Date(report.created_at).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminActivity;
