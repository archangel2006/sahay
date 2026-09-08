import React from 'react';
import { ArrowLeft, Sparkles, Activity } from 'lucide-react';
import { ActivityId } from '../../types';
import { ACTIVITIES } from './activityRegistry';
import { MemoryMatch } from './games/MemoryMatch';
import { PatternRecall } from './games/PatternRecall';
import { RoutineRecall } from './games/RoutineRecall';
import { SpotDifference } from './games/SpotDifference';
import { ContributePlaceholder } from './games/ContributePlaceholder';

interface ActivityHostProps {
  activityId: ActivityId;
  onBack: () => void;
  showToast: (msg: string, icon?: string) => void;
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
}

export const ActivityHost: React.FC<ActivityHostProps> = ({
  activityId,
  onBack,
  showToast,
  onSessionComplete,
}) => {
  const meta = ACTIVITIES.find((a) => a.id === activityId) || ACTIVITIES[0];

  const renderGameContent = () => {
    switch (activityId) {
      case 'memory':
        return <MemoryMatch onSessionComplete={onSessionComplete} showToast={showToast} />;
      case 'pattern':
        return <PatternRecall onSessionComplete={onSessionComplete} showToast={showToast} />;
      case 'routine':
        return <RoutineRecall onSessionComplete={onSessionComplete} showToast={showToast} />;
      case 'spot':
        return <SpotDifference onSessionComplete={onSessionComplete} showToast={showToast} />;
      case 'faces':
      case 'odd':
      case 'numbers':
      default:
        return <ContributePlaceholder activity={meta} showToast={showToast} />;
    }
  };

  return (
    <div className="bg-white border border-[#E6DAB9] rounded-3xl p-6 md:p-8 shadow-xs animate-rise">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-[#E6DAB9]/60 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-baloo font-bold text-sm text-[#22403A] hover:text-[#152B26] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all activities
        </button>

        <div className="flex items-center gap-2">
          <span className="font-baloo text-xs font-bold px-3 py-1 rounded-full bg-[#E4ECE7] text-[#22403A] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            {meta.category} · Level {meta.level} of {meta.maxLevel}
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B] mb-1">
          {meta.title}
        </h2>
        <p className="text-sm text-[#665F51]">{meta.description}</p>
      </div>

      {renderGameContent()}
    </div>
  );
};
