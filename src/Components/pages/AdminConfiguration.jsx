import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { api } from "../../services/api";

const AdminConfiguration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [activeKey, setActiveKey] = useState("");
  const activePrompt = prompts.find((prompt) => prompt.key === activeKey);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getAdminPrompts();
      setPrompts(data.prompts || []);
      setActiveKey(data.prompts?.[0]?.key || "");
    } catch (err) {
      setError(err.message || "Failed to load prompts");
      if (err.message?.includes("401")) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const updateLocalPrompt = (field, value) => {
    setPrompts((current) =>
      current.map((prompt) =>
        prompt.key === activeKey ? { ...prompt, [field]: value } : prompt
      )
    );
  };

  const savePrompt = async () => {
    if (!activePrompt) return;
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const updated = await api.updateAdminPrompt(activePrompt.key, {
        title: activePrompt.title,
        content: activePrompt.content,
      });
      setPrompts((current) => current.map((prompt) => (prompt.key === updated.key ? updated : prompt)));
      setSuccess("Prompt saved. New analyses and agent chats will use this configuration.");
    } catch (err) {
      setError(err.message || "Failed to save prompt");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
          <p className="text-gray-600 mt-1">Edit Gemini prompts from the admin UI instead of changing code.</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">{success}</div>}

        <div className="grid grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white rounded-xl border border-gray-200 p-4 h-fit">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Prompt Library</div>
            <div className="space-y-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt.key}
                  onClick={() => setActiveKey(prompt.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg ${
                    prompt.key === activeKey ? "bg-blue-50 text-primary font-semibold" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div>{prompt.title}</div>
                  <div className="text-xs text-gray-500">{prompt.key}</div>
                </button>
              ))}
            </div>
          </aside>

          {activePrompt && (
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt Title</label>
                  <input
                    value={activePrompt.title}
                    onChange={(event) => updateLocalPrompt("title", event.target.value)}
                    className="w-[420px] px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={savePrompt}
                  disabled={saving}
                  className="px-5 py-2 bg-primary text-white rounded-lg disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Prompt"}
                </button>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt Content</label>
              <textarea
                value={activePrompt.content}
                onChange={(event) => updateLocalPrompt("content", event.target.value)}
                className="w-full min-h-[520px] px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm leading-6"
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguration;
