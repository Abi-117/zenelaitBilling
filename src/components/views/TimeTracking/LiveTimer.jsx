import { useState, useEffect } from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';

const LiveTimer = ({ project, onStop }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const handleStop = () => {
    setRunning(false);
    onStop(seconds);
    setSeconds(0);
  };

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
      <div>
        <p className="font-bold">{project}</p>
        <p className="text-xl font-mono">{formatTime(seconds)}</p>
      </div>
      <div className="flex space-x-2">
        {!running ? (
          <button onClick={() => setRunning(true)} className="p-2 bg-emerald-500 rounded-full text-white">
            <PlayCircle size={20} />
          </button>
        ) : (
          <button onClick={handleStop} className="p-2 bg-rose-500 rounded-full text-white">
            <PauseCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveTimer;
