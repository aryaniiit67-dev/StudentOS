import React, { useState, useEffect } from 'react';

interface FocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTitle: string;
}

export const FocusModal: React.FC<FocusModalProps> = ({
  isOpen,
  onClose,
  targetTitle,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            alert('Deep Work Sprint Finished! Well done, Alex.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isOpen) return null;

  const m = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
  const s = (secondsRemaining % 60).toString().padStart(2, '0');

  const toggleRun = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(45 * 60);
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container-low max-w-md w-full rounded-2xl p-space-md sm:p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-highest">
        <div className="flex items-center justify-between border-b border-surface-container-highest/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">timer</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Deep Work Sprint</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer"
            aria-label="Close focus timer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 bg-surface-container-lowest rounded-xl border border-surface-container-highest/20">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-mono">
            {targetTitle || 'Mathematics III Focus'}
          </span>
          <div className="font-stat-numeric text-[48px] leading-none text-primary font-bold my-2 font-mono">
            {m}:{s}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm font-mono mt-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span>Binaural 40Hz Audio Channel Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleRun}
            className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pause Sprint' : secondsRemaining < 45 * 60 ? 'Resume Sprint' : 'Start Sprint'}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-md font-mono cursor-pointer"
            title="Reset to 45m"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-body-md text-body-md cursor-pointer font-mono"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
};
