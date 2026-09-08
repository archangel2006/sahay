import React, { useState } from 'react';
import { Clock, Plus, Search, Check, Pill, Droplet, Activity, Calendar } from 'lucide-react';
import { ReminderItem } from '../../types';

interface RemindersViewProps {
  reminders: ReminderItem[];
  onToggle: (id: string) => void;
  onAdd: (txt: string, time: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onToggle,
  onAdd,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newTime, setNewTime] = useState('');

  const filtered = reminders.filter((r) =>
    r.txt.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) {
      showToast('Type a reminder first', 'alert');
      return;
    }
    onAdd(newText.trim(), newTime.trim() || 'Anytime');
    setNewText('');
    setNewTime('');
    setIsFormOpen(false);
    showToast('Reminder added', 'plus');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'pill':
        return <Pill className="w-4 h-4" />;
      case 'droplet':
        return <Droplet className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'calendar':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTintClass = (tint: string) => {
    switch (tint) {
      case 'ic-clay':
        return 'bg-[#F5E1D6] text-[#BD5B3B]';
      case 'ic-indigo':
        return 'bg-[#E5E9F1] text-[#3E4F74]';
      case 'ic-forest':
        return 'bg-[#E4ECE7] text-[#22403A]';
      case 'ic-marigold':
        return 'bg-[#F8E6C1] text-[#8A5D18]';
      default:
        return 'bg-[#E4ECE7] text-[#22403A]';
    }
  };

  return (
    <div className="animate-rise max-w-[1180px]">
      <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider mb-2">
        <Clock className="w-3.5 h-3.5" />
        Care Schedule
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B]">
          All Reminders
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E6DAB9] bg-white text-[#221F1B] font-baloo font-bold text-xs hover:border-[#22403A] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add reminder
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 p-4 bg-[#F1E7CE] rounded-2xl mb-5 border border-[#E6DAB9]"
        >
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="What is the reminder?"
            className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] bg-white text-sm focus:outline-2 focus:outline-[#22403A]"
          />
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="Time (e.g. 6:00 PM)"
            className="w-44 px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] bg-white text-sm focus:outline-2 focus:outline-[#22403A]"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E2A33D] text-[#152B26] font-baloo font-bold text-sm hover:brightness-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
      )}

      <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#948C7A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reminders…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
          />
        </div>

        <div className="divide-y divide-[#E6DAB9]">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#948C7A]">
              No reminders match your search.
            </div>
          ) : (
            filtered.map((reminder) => (
              <div key={reminder.id} className="flex items-center gap-3.5 py-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getTintClass(
                    reminder.tint
                  )}`}
                >
                  {getIcon(reminder.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-bold text-[#221F1B] ${
                      reminder.done ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {reminder.txt}
                  </div>
                  <div className="text-xs text-[#665F51]">{reminder.time}</div>
                </div>
                <button
                  onClick={() => onToggle(reminder.id)}
                  className={`w-8 h-8 rounded-full border-2 border-[#3F7455] flex items-center justify-center cursor-pointer transition-all ${
                    reminder.done ? 'bg-[#3F7455] text-white' : 'bg-transparent text-transparent hover:bg-[#E4ECE7]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
