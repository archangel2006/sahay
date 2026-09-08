import React, { useState } from 'react';
import {
  Users,
  Plus,
  Play,
  Phone,
  MapPin,
  Volume2,
  Mic,
  Image as ImageIcon,
  Sparkles,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { FamilyMemberItem } from '../../types';

interface MemoryBookViewProps {
  familyMembers: FamilyMemberItem[];
  onAddFamilyMember: (item: Omit<FamilyMemberItem, 'id'>) => void;
  showToast: (msg: string, icon?: string) => void;
  elderName?: string;
  onNavigateToInsights?: () => void;
}

export const MemoryBookView: React.FC<MemoryBookViewProps> = ({
  familyMembers,
  onAddFamilyMember,
  showToast,
  elderName = 'Bimala aita',
  onNavigateToInsights,
}) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [rel, setRel] = useState('');
  const [fact, setFact] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [voiceNoteText, setVoiceNoteText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const playVoiceNote = (idx: number, member: FamilyMemberItem) => {
    if (playingIndex !== null) return;
    setPlayingIndex(idx);

    const message = member.voiceNoteText || `Namaskar ${elderName}! We are thinking of you and sending warm love.`;
    showToast(`Playing voice greeting from ${member.name}…`, 'play');

    // Use speech synthesis if available for elder audio experience
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.05;
        utterance.onend = () => setPlayingIndex(null);
        utterance.onerror = () => setPlayingIndex(null);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setTimeout(() => setPlayingIndex(null), 3000);
      }
    } else {
      setTimeout(() => setPlayingIndex(null), 3000);
    }
  };

  const handleSimulateRecord = () => {
    setIsRecording(true);
    showToast('Recording voice note for 2 seconds…', 'mic');
    setTimeout(() => {
      setIsRecording(false);
      const defaultNotes = [
        `"Namaste Aita! Have a serene day and drink your warm tea."`,
        `"Thinking of you today, Aita! Mridul says hello."`,
        `"We love you, Aita! See you this Sunday."`,
      ];
      const randomNote = defaultNotes[Math.floor(Math.random() * defaultNotes.length)];
      setVoiceNoteText(randomNote);
      showToast('Voice greeting captured!', 'check');
    }, 2000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rel.trim()) {
      showToast('Please provide a name and relationship', 'alert');
      return;
    }

    const palette = ['#3E4F74', '#BD5B3B', '#22403A', '#8A5D18', '#3F7455'];
    const chosenColor = palette[familyMembers.length % palette.length];

    onAddFamilyMember({
      name: name.trim(),
      rel: rel.trim(),
      fact: fact.trim() || `A cherished person in ${elderName}’s life.`,
      color: chosenColor,
      imageUrl: imageUrl.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      voiceNoteText: voiceNoteText.trim() || undefined,
    });

    // Reset
    setName('');
    setRel('');
    setFact('');
    setPhone('');
    setAddress('');
    setVoiceNoteText('');
    setImageUrl('');
    setIsModalOpen(false);
    showToast(`${name} added to the Memory Book!`, 'check');
  };

  const getInitials = (personName: string) => {
    return personName
      .replace(/\s*\(.*?\)\s*/g, '')
      .trim()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleCallMember = (member: FamilyMemberItem) => {
    if (member.phone) {
      showToast(`Calling ${member.name} (${member.phone})…`, 'phone');
    } else {
      showToast(`Calling ${member.name} via family quick connect…`, 'phone');
    }
  };

  const samplePhotoAvatars = [
    { label: 'Son / Elder Man', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
    { label: 'Daughter / Niece', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
    { label: 'Grandchild', url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&auto=format&fit=crop&q=80' },
    { label: 'Elder Friend', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="animate-rise max-w-[1180px]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider mb-1.5">
            <Heart className="w-3.5 h-3.5 text-[#BD5B3B]" />
            Family &amp; Loved Ones
          </div>
          <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B]">
            {elderName}’s Memory Book
          </h2>
          <p className="text-xs sm:text-sm text-[#665F51] mt-1 max-w-xl">
            A comforting digital album with familiar photos, home addresses to visit, phone contacts, and recorded voices of beloved family members.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        </div>
      </div>

      {/* Grid of Family Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {familyMembers.map((member, i) => {
          const isPlaying = playingIndex === i;
          return (
            <div
              key={member.id}
              className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div>
                {/* Photo or Initials Badge */}
                <div className="flex items-start gap-4 mb-4">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E6DAB9] shrink-0 shadow-xs"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: member.color }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-fraunces text-xl font-bold text-white shrink-0 shadow-xs"
                    >
                      {getInitials(member.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-baloo font-bold text-lg text-[#221F1B] leading-tight truncate">
                      {member.name}
                    </h3>
                    <div className="inline-block text-[11px] font-baloo font-bold text-[#BD5B3B] bg-[#F5E1D6]/70 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 mb-1">
                      {member.rel}
                    </div>

                    {member.phone && (
                      <p className="text-xs text-[#665F51] flex items-center gap-1 font-medium">
                        <Phone className="w-3 h-3 text-[#22403A]" />
                        <span>{member.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Warm Memory Quote */}
                <div className="p-3 bg-[#FBF7EE] rounded-xl border border-[#E6DAB9]/60 mb-3.5">
                  <span className="text-[11px] font-baloo font-bold text-[#8A5D18] block mb-0.5">
                    Cherished Memory:
                  </span>
                  <p className="text-xs text-[#221F1B] leading-relaxed italic">
                    "{member.fact}"
                  </p>
                </div>

                {/* Address details if available */}
                {member.address && (
                  <div className="flex items-start gap-2 text-xs text-[#665F51] mb-3.5 px-1">
                    <MapPin className="w-3.5 h-3.5 text-[#22403A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[#221F1B] block">Home Address / Location:</span>
                      <span className="text-[11px]">{member.address}</span>
                    </div>
                  </div>
                )}

                {/* Voice Note snippet if present */}
                {member.voiceNoteText && (
                  <div className="flex items-start gap-2 text-xs text-[#22403A] bg-[#E4ECE7]/60 p-2.5 rounded-xl border border-[#22403A]/20 mb-4">
                    <Volume2 className="w-3.5 h-3.5 text-[#22403A] shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight">
                      <b className="font-baloo">Voice Greeting:</b> {member.voiceNoteText}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6DAB9]/60">
                <button
                  type="button"
                  onClick={() => playVoiceNote(i, member)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-baloo font-bold text-xs cursor-pointer transition-colors ${
                    isPlaying
                      ? 'bg-[#F8E6C1] text-[#8A5D18] border border-[#E2A33D]'
                      : 'bg-[#E4ECE7] text-[#22403A] hover:bg-[#22403A] hover:text-[#FBF7EE]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                      <span>Speaking…</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Play Voice</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCallMember(member)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-[#E6DAB9] text-[#221F1B] hover:bg-[#F1E7CE] font-baloo font-bold text-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#BD5B3B]" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Member Card */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent border-2 border-dashed border-[#E6DAB9] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#22403A] hover:bg-white/50 transition-all min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F1E7CE] flex items-center justify-center text-[#22403A] mb-3">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="font-baloo font-bold text-base text-[#22403A]">
            Add Family Member
          </span>
          <span className="text-xs text-[#665F51] mt-1 max-w-[200px]">
            Add photos, home address to visit, phone number &amp; voice clips
          </span>
        </div>
      </div>

      {/* Add Family Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-rise my-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-fraunces text-2xl font-medium text-[#221F1B]">
                Add to Memory Book
              </h3>
              <span className="text-[11px] font-baloo font-bold text-[#E2A33D] bg-[#F8E6C1] px-2 py-0.5 rounded-full">
                Family &amp; Loved Ones
              </span>
            </div>
            <p className="text-xs text-[#665F51] mb-5">
              Add someone {elderName} holds dear. You can upload a photo, specify where they live so they can visit, and even attach a recorded voice greeting.
            </p>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anita"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    required
                    value={rel}
                    onChange={(e) => setRel(e.target.value)}
                    placeholder="e.g. Niece / Granddaughter"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
              </div>

              {/* Photo Input or Quick Select */}
              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Photo (Image URL or Pick Sample Avatar)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image web link (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-xs focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] text-[#948C7A] shrink-0 font-medium">Quick samples:</span>
                  {samplePhotoAvatars.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(sample.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-baloo font-bold shrink-0 transition-colors ${
                        imageUrl === sample.url
                          ? 'bg-[#22403A] text-white border-[#22403A]'
                          : 'bg-[#FBF7EE] text-[#665F51] border-[#E6DAB9] hover:border-[#22403A]'
                      }`}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98640 12345"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                    Home Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Tea Garden Road, Jorhat"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Cherished Memory or Fun Fact
                </label>
                <textarea
                  value={fact}
                  onChange={(e) => setFact(e.target.value)}
                  placeholder="Something warm that triggers joyful recognition (e.g. Brings you jasmine flowers every Sunday)"
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A] resize-none"
                />
              </div>

              {/* Voice Note Section */}
              <div className="p-3.5 rounded-2xl bg-[#FBF7EE] border border-[#E6DAB9]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-baloo font-bold text-[#22403A] flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-[#BD5B3B]" />
                    <span>Recorded Voice Greeting</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSimulateRecord}
                    className={`text-[11px] font-baloo font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      isRecording
                        ? 'bg-[#BD5B3B] text-white border-[#BD5B3B] animate-pulse'
                        : 'bg-[#E4ECE7] text-[#22403A] border-[#22403A]/20 hover:bg-[#22403A] hover:text-white'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isRecording ? 'Recording…' : 'Record Sample Voice'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={voiceNoteText}
                  onChange={(e) => setVoiceNoteText(e.target.value)}
                  placeholder="Greeting text spoken by this family member (e.g. Namaste Aita!)"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E6DAB9] bg-white text-xs focus:outline-2 focus:outline-[#22403A]"
                />
                <p className="text-[10px] text-[#948C7A] mt-1.5">
                  When {elderName} taps "Play Voice", Sahay reads this warm greeting aloud.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E6DAB9] font-baloo font-bold text-sm text-[#221F1B] hover:bg-[#F1E7CE] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer shadow-xs"
                >
                  Save to Memory Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
