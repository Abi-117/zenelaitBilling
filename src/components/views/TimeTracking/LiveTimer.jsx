import { useState, useEffect } from 'react';
import { PlayCircle, StopCircle } from 'lucide-react';

const LiveTimer = ({ project, onStop }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const stopTimer = () => {
    setRunning(false);
    onStop(seconds);
    setSeconds(0);
  };

  const format = s => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2,'0')}:${m
      .toString()
      .padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  return (
    <div className="bg-white rounded-xl p-4 border flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-500">Live Timer</p>
        <p className="font-bold">{project}</p>
        <p className="text-xl font-mono">{format(seconds)}</p>
      </div>

      {!running ? (
        <button
          onClick={() => setRunning(true)}
          className="bg-emerald-500 text-white p-3 rounded-full"
        >
          <PlayCircle size={20} />
        </button>
      ) : (
        <button
          onClick={stopTimer}
          className="bg-rose-500 text-white p-3 rounded-full"
        >
          <StopCircle size={20} />
        </button>
      )}
    </div>
  );
};

export default LiveTimer;
