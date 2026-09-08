import React from 'react';
import { Layers, Activity, Sparkles, Leaf, Grid, Calendar, Eye, User, Hash } from 'lucide-react';
import { ActivityId } from '../../types';
import { ACTIVITIES } from './activityRegistry';

interface ActivitiesViewProps {
  onSelectGame: (id: ActivityId) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ onSelectGame }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'leaf':
        return <Leaf className="w-6 h-6" />;
      case 'grid':
        return <Grid className="w-6 h-6" />;
      case 'calendar':
        return <Calendar className="w-6 h-6" />;
      case 'eye':
        return <Eye className="w-6 h-6" />;
      case 'user':
        return <User className="w-6 h-6" />;
      case 'hash':
        return <Hash className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getTint = (id: string) => {
    switch (id) {
      case 'memory':
        return 'bg-[#F8E6C1] text-[#8A5D18]';
      case 'pattern':
        return 'bg-[#E5E9F1] text-[#3E4F74]';
      case 'routine':
        return 'bg-[#E4ECE7] text-[#22403A]';
      case 'spot':
        return 'bg-[#F5E1D6] text-[#BD5B3B]';
      case 'faces':
        return 'bg-[#E5E9F1] text-[#3E4F74]';
      case 'odd':
        return 'bg-[#F8E6C1] text-[#8A5D18]';
      case 'numbers':
        return 'bg-[#E4ECE7] text-[#22403A]';
      default:
        return 'bg-[#E4ECE7] text-[#22403A]';
    }
  };

  return (
    <div className="animate-rise max-w-[1180px]">
      <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider mb-2">
        <Layers className="w-3.5 h-3.5" />
        Cognitive Activities
      </div>

      <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B] mb-6">
        Pick Something to Play
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACTIVITIES.map((act) => (
          <div
            key={act.id}
            onClick={() => onSelectGame(act.id)}
            className="bg-white border border-[#E6DAB9] rounded-2xl p-5 flex items-start gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all shadow-xs"
          >
            <div
              className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${getTint(
                act.id
              )}`}
            >
              {getIcon(act.iconName)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-baloo font-bold text-base text-[#221F1B]">{act.title}</h4>
              </div>

              <p className="text-xs text-[#665F51] mb-2.5 leading-relaxed">{act.description}</p>

              <div className="flex items-center gap-2">
                <span className="font-baloo text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FBF7EE] text-[#665F51] border border-[#E6DAB9]">
                  {act.category}
                </span>
                <span className="font-baloo text-[11px] font-bold text-[#948C7A]">
                  Level {act.level} of {act.maxLevel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
