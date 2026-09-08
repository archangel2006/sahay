import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { AppointmentItem } from '../../types';

interface AppointmentsViewProps {
  appointments: AppointmentItem[];
  onAdd: (item: Omit<AppointmentItem, 'id'>) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onAdd,
  showToast,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Add a doctor or purpose first', 'alert');
      return;
    }
    const [d = '—', m = ''] = date.includes(' ') ? date.split(' ') : [date, ''];
    onAdd({
      title: title.trim(),
      date: d,
      month: m.toUpperCase() || 'UPCOMING',
      time: time.trim() || 'Time TBD',
      mode: 'To be confirmed',
    });
    setTitle('');
    setDate('');
    setTime('');
    setIsFormOpen(false);
    showToast('Appointment added', 'plus');
  };

  return (
    <div className="animate-rise max-w-[1180px]">
      <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider mb-2">
        <Calendar className="w-3.5 h-3.5" />
        Medical Care
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B]">
          Upcoming Appointments
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E6DAB9] bg-white text-[#221F1B] font-baloo font-bold text-xs hover:border-[#22403A] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add appointment
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 p-4 bg-[#F1E7CE] rounded-2xl mb-5 border border-[#E6DAB9]"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Doctor or purpose (e.g. Dr. Baruah — Neurology)"
            className="flex-1 min-w-[220px] px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] bg-white text-sm focus:outline-2 focus:outline-[#22403A]"
          />
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date (e.g. 12 Sep)"
            className="w-36 px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] bg-white text-sm focus:outline-2 focus:outline-[#22403A]"
          />
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Time (e.g. 4:00 PM)"
            className="w-36 px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] bg-white text-sm focus:outline-2 focus:outline-[#22403A]"
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

      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 rounded-2xl border border-[#E6DAB9] bg-white shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#E4ECE7] text-[#22403A] flex flex-col items-center justify-center font-baloo shrink-0">
              <span className="text-xl font-extrabold leading-none">{appt.date}</span>
              <span className="text-[10px] font-bold uppercase">{appt.month}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-baloo font-bold text-base text-[#221F1B] mb-0.5">{appt.title}</h4>
              <p className="text-xs text-[#665F51]">
                {appt.time} · {appt.mode}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => showToast('Opening location and navigation…', 'calendar')}
                className="px-3.5 py-2 rounded-xl border border-[#E6DAB9] bg-white text-[#22403A] font-baloo font-bold text-xs hover:border-[#22403A] transition-colors cursor-pointer"
              >
                Directions
              </button>
              <button
                onClick={() => showToast('Joining video appointment session…', 'phone')}
                className="px-4 py-2 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
