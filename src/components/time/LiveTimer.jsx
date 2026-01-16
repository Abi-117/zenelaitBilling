import { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

const LiveTimer = ({ project = 'Select Project', onStop }) => {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const formatTime = () => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const stopTimer = () => {
    setRunning(false);
    onStop?.(seconds);
    setSeconds(0);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">Working on</p>
        <p className="font-semibold">{project}</p>
        <p className="text-xl font-mono mt-1">{formatTime()}</p>
      </div>

      {!running ? (
        <button
          onClick={() => setRunning(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          <Play size={16} /> Start
        </button>
      ) : (
        <button
          onClick={stopTimer}
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg"
        >
          <Square size={16} /> Stop
        </button>
      )}
    </div>
  );
};

export default LiveTimer;
