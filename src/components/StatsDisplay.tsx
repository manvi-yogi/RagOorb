import React from 'react';
import { Clock, Target, Zap, CheckCircle } from 'lucide-react';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  isActive: boolean;
  completed: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  wpm,
  accuracy,
  timeElapsed,
  isActive,
  completed,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="text-2xl font-bold text-white">{wpm}</div>
        <div className="text-sm text-gray-400">WPM</div>
      </div>

      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Target className="h-5 w-5 text-green-400" />
        </div>
        <div className="text-2xl font-bold text-white">{accuracy.toFixed(1)}%</div>
        <div className="text-sm text-gray-400">Accuracy</div>
      </div>

      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-5 w-5 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-white">{formatTime(timeElapsed)}</div>
        <div className="text-sm text-gray-400">Time</div>
      </div>

      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="h-5 w-5 text-purple-400" />
        </div>
        <div className="text-2xl font-bold text-white">
          {completed ? 'Complete' : isActive ? 'Active' : 'Ready'}
        </div>
        <div className="text-sm text-gray-400">Status</div>
      </div>
    </div>
  );
};
