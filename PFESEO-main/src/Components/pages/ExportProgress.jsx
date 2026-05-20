import { useEffect, useState } from "react";

export default function ExportProgress({ taskId, userId, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/export/${userId}`);
    
    ws.onopen = () => setConnected(true);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.task_id === taskId) {
        setProgress(data.progress);
        setMessage(data.message);
        if (data.progress === 100) {
          setTimeout(() => onComplete?.(), 500);
        }
      }
    };
    
    ws.onerror = () => setMessage("Connection error");
    
    return () => ws.close();
  }, [taskId, userId, onComplete]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{message}</span>
        <span className="font-bold text-blue-600">{progress}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {!connected && <p className="text-xs text-orange-500">⚠️ Connecting...</p>}
    </div>
  );
}