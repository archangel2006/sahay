import React from 'react';
import { GitPullRequest, Code2, Sparkles, CheckCircle2, Copy } from 'lucide-react';
import { ActivityMeta } from '../../../types';

interface ContributePlaceholderProps {
  activity: ActivityMeta;
  showToast: (msg: string, icon?: string) => void;
}

export const ContributePlaceholder: React.FC<ContributePlaceholderProps> = ({ activity, showToast }) => {
  const copyContributionTemplate = () => {
    const template = `// Contributor Template for ${activity.title} (${activity.id})
// 1. Create file: src/features/activities/games/${activity.id}.tsx
// 2. Implement: export const ${activity.id.charAt(0).toUpperCase() + activity.id.slice(1)}Game: React.FC<ActivityProps>
// 3. Register in src/features/activities/activityRegistry.ts (set status: 'active')
// Target Cognitive Domain: ${activity.category}`;
    navigator.clipboard?.writeText(template);
    showToast('Contribution starter snippet copied to clipboard!', 'check');
  };

  return (
    <div className="max-w-[540px] mx-auto text-center py-6">
      <div className="w-16 h-16 rounded-2xl bg-[#E4ECE7] text-[#22403A] flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8E6C1] text-[#8A5D18] text-xs font-baloo font-bold uppercase tracking-wider mb-3">
        Next in Session
      </div>

      <h3 className="font-fraunces text-2xl font-medium text-[#221F1B] mb-2">
        {activity.title}
      </h3>
      <p className="text-sm text-[#665F51] mb-6 max-w-[440px] mx-auto leading-relaxed">
        {activity.description}. This guided cognitive exercise is currently being tuned for gentle daily practice.
      </p>

      <div className="bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-5 text-left mb-6">
        <h4 className="font-baloo font-bold text-sm text-[#22403A] mb-2 flex items-center gap-2">
          Exercise Details
        </h4>
        <div className="space-y-1.5 text-xs text-[#665F51]">
          <p><strong>Cognitive Focus:</strong> {activity.category}</p>
          <p><strong>Designed For:</strong> Memory strengthening and peaceful engagement</p>
          <p><strong>Difficulty Progression:</strong> Levels 1 to {activity.maxLevel}</p>
        </div>
      </div>

      <p className="text-xs text-[#948C7A]">
        In the meantime, feel free to explore Memory Match, Pattern Recall, or Daily Routine Recall!
      </p>
    </div>
  );
};
