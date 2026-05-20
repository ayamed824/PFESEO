import { useState } from "react";
import { Download, X, Loader2, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

/**
 * ExportModal Component
 * Handles PDF/CSV export with format selection and options
 * 
 * @param {Object} props
 * @param {string} props.section - Section to export: "full", "technical", "content", "ux", "popularity"
 * @param {string} props.url - URL being analyzed
 * @param {Function} props.onExportStarted - Callback when export starts (receives taskId)
 * @param {Function} props.onCancel - Callback when modal is cancelled
 */
export default function ExportModal({ 
  section = "full", 
  url = "", 
  onExportStarted, 
  onCancel 
}) {
  const [format, setFormat] = useState("pdf");
  const [includeReco, setIncludeReco] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [lang, setLang] = useState("fr");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!url) {
      toast.error("Please enter a URL to analyze");
      return;
    }

    setLoading(true);
    try {
      const blob = await api.exportReport(url, {
        format,
        section,
        includeReco,
        includeCharts,
        lang,
      });

      const filename = `seo-report-${section}-${new Date().toISOString().slice(0, 10)}.${format}`;
      api.downloadFile(blob, filename);

      toast.success(`✅ ${section.toUpperCase()} report downloaded!`);

      const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      onExportStarted?.(taskId);

      setTimeout(() => onCancel?.(), 500);

    } catch (error) {
      console.error("Export error:", error);
      toast.error("❌ Export failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format options - JSON REMOVED
  const formatOptions = [
    { value: "pdf", label: "📄 PDF", desc: "Printable full report" },
    { value: "csv", label: "📊 CSV", desc: "Raw data for Excel" },
  ];

  const renderFormatLabel = (label) => {
    const [icon, ...text] = label.split(" ");
    return { icon, text: text.join(" ") };
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 
            id="export-modal-title"
            className="text-xl font-bold text-gray-800 flex items-center gap-2"
          >
            <FileText className="text-blue-600" size={20} /> 
            Export Report
          </h3>
          <button 
            onClick={() => onCancel?.()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Section info badge */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <b>Section: </b> 
              {section === "full" 
                ? "📊 Full Report" 
                : `📑 ${section.toUpperCase().replace("_", " / ")}`}
            </p>
            {url && (
              <p className="text-xs text-blue-600 mt-1 truncate">
                URL: {new URL(url).hostname}
              </p>
            )}
          </div>

          {/* Format Selection - Now 2 columns instead of 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((opt) => {
                const { icon, text } = renderFormatLabel(opt.label);
                const isSelected = format === opt.value;
                
                return (
                  <label
                    key={opt.value}
                    className={`
                      cursor-pointer border-2 rounded-xl p-3 text-center transition-all
                      ${isSelected 
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="export-format"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => setFormat(opt.value)}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-1" aria-hidden="true">{icon}</div>
                    <div className="text-xs font-medium text-gray-900">{text}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{opt.desc}</div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🌍 Language / Langue
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  lang === "fr"
                    ? "bg-blue-600 text-white ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🇫🇷 Français
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  lang === "en"
                    ? "bg-blue-600 text-white ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeReco}
                onChange={() => setIncludeReco(!includeReco)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                🧠 Include AI recommendations
              </span>
            </label>

            {format === "pdf" && (
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={() => setIncludeCharts(!includeCharts)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  📈 Include charts & graphs
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => onCancel?.()}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg 
                     hover:bg-gray-100 transition-colors font-medium text-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors font-medium 
                     flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}