import React, { useState } from 'react';
import {
  Users,
  Plus,
  Play,
  Phone,
  MapPin,
  Volume2,
  Mic,
  Heart,
  Edit2,
  Navigation,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';
import { FamilyMemberItem } from '../../types';

interface MemoryBookViewProps {
  familyMembers: FamilyMemberItem[];
  onAddFamilyMember: (item: Omit<FamilyMemberItem, 'id'>) => void;
  onUpdateFamilyMember?: (item: FamilyMemberItem) => void;
  showToast: (msg: string, icon?: string) => void;
  elderName?: string;
  onNavigateToInsights?: () => void;
}

export const MemoryBookView: React.FC<MemoryBookViewProps> = ({
  familyMembers,
  onAddFamilyMember,
  onUpdateFamilyMember,
  showToast,
  elderName = 'Bimala aita',
  onNavigateToInsights,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberItem | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMemberItem | null>(null);

  // Add Form state
  const [name, setName] = useState('');
  const [rel, setRel] = useState('');
  const [fact, setFact] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [voiceNoteText, setVoiceNoteText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Edit Form state
  const [editName, setEditName] = useState('');
  const [editRel, setEditRel] = useState('');
  const [editFact, setEditFact] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editVoiceNoteText, setEditVoiceNoteText] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const samplePhotoAvatars = [
    { label: 'Son / Elder Man', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80' },
    { label: 'Daughter / Niece', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80' },
    { label: 'Grandchild', url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=500&auto=format&fit=crop&q=80' },
    { label: 'Elder Friend', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' },
  ];

  const playVoiceNote = (member: FamilyMemberItem) => {
    if (playingId === member.id) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(member.id);
    const message = member.voiceNoteText || `Namaskar ${elderName}! We are thinking of you and sending our warmest love.`;
    showToast(`Playing voice greeting from ${member.name}…`, 'play');

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.05;
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setTimeout(() => setPlayingId(null), 3000);
      }
    } else {
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const handleCallMember = (member: FamilyMemberItem) => {
    if (member.phone) {
      showToast(`Calling ${member.name} (${member.phone})…`, 'phone');
    } else {
      showToast(`Calling ${member.name} via quick connect…`, 'phone');
    }
  };

  const openDirections = (member: FamilyMemberItem) => {
    const destination = member.address || `${member.name}'s house, Jorhat`;
    showToast(`Opening directions to ${member.name}’s house…`, 'map');
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const startEditing = (member: FamilyMemberItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingMember(member);
    setEditName(member.name);
    setEditRel(member.rel);
    setEditFact(member.fact);
    setEditPhone(member.phone || '');
    setEditAddress(member.address || '');
    setEditVoiceNoteText(member.voiceNoteText || '');
    setEditImageUrl(member.imageUrl || '');
    // If detail modal was open, close it while editing
    setSelectedMember(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editName.trim() || !editRel.trim()) {
      showToast('Please provide a name and relationship', 'alert');
      return;
    }

    const updatedItem: FamilyMemberItem = {
      ...editingMember,
      name: editName.trim(),
      rel: editRel.trim(),
      fact: editFact.trim() || `A cherished person in ${elderName}’s life.`,
      imageUrl: editImageUrl.trim() || undefined,
      phone: editPhone.trim() || undefined,
      address: editAddress.trim() || undefined,
      voiceNoteText: editVoiceNoteText.trim() || undefined,
    };

    if (onUpdateFamilyMember) {
      onUpdateFamilyMember(updatedItem);
    }
    showToast(`${updatedItem.name}’s profile updated!`, 'check');
    setEditingMember(null);
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

    setName('');
    setRel('');
    setFact('');
    setPhone('');
    setAddress('');
    setVoiceNoteText('');
    setImageUrl('');
    setIsAddModalOpen(false);
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

  return (
    <div className="animate-rise max-w-[1180px]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 text-[#BD5B3B]" />
            Family &amp; Loved Ones
          </div>
          <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B]">
            {elderName}’s Memory Book
          </h2>
          <p className="text-xs sm:text-sm text-[#665F51] mt-1 max-w-xl">
            Tap any card to view directions to their home, warm memories, or voice greetings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Grid of Visual-First Photo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => {
          const isPlaying = playingId === member.id;
          return (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-white border border-[#E6DAB9] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col group relative"
            >
              {/* Big Visual Photo Area */}
              <div className="relative h-56 w-full bg-[#F1E7CE] overflow-hidden">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: member.color }}
                    className="w-full h-full flex flex-col items-center justify-center text-white"
                  >
                    <span className="font-fraunces text-4xl font-bold">{getInitials(member.name)}</span>
                    <span className="text-xs font-baloo mt-1 opacity-80">{member.name}</span>
                  </div>
                )}

                {/* Subtle gradient vignette at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Top badges: Relationship and Quick Edit */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                  <span className="text-[11px] font-baloo font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider shadow-xs border border-white/20">
                    {member.rel}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => startEditing(member, e)}
                    title="Edit profile"
                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#221F1B] flex items-center justify-center backdrop-blur-md shadow-sm transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name on the bottom of the photo */}
                <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                  <h3 className="font-fraunces text-2xl font-bold text-white drop-shadow-md leading-tight">
                    {member.name}
                  </h3>
                  {member.address && (
                    <p className="text-white/85 text-[11px] font-medium flex items-center gap-1 drop-shadow-xs mt-0.5">
                      <MapPin className="w-3 h-3 text-[#E2A33D]" />
                      <span className="truncate">{member.address}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Clean Bottom Controls (No raw phone numbers or text clutter) */}
              <div className="p-4 bg-white flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-[#948C7A]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E2A33D]" />
                    Tap card to view full story &amp; map
                  </span>
                  {member.voiceNoteText && (
                    <span className="text-[10px] font-bold text-[#22403A] bg-[#E4ECE7] px-2 py-0.5 rounded-full">
                      Voice note ready
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceNote(member);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-baloo font-bold text-xs cursor-pointer transition-all ${
                      isPlaying
                        ? 'bg-[#F8E6C1] text-[#8A5D18] border border-[#E2A33D] scale-98 animate-pulse'
                        : 'bg-[#E4ECE7] text-[#22403A] hover:bg-[#22403A] hover:text-[#FBF7EE]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'Speaking…' : 'Play Voice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCallMember(member);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white border border-[#E6DAB9] text-[#221F1B] hover:bg-[#F5E1D6] hover:text-[#BD5B3B] hover:border-[#BD5B3B]/40 font-baloo font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#BD5B3B]" />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Member Card */}
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="bg-transparent border-2 border-dashed border-[#E6DAB9] rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#22403A] hover:bg-white/60 transition-all min-h-[300px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#F1E7CE] flex items-center justify-center text-[#22403A] mb-3 shadow-xs">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="font-baloo font-bold text-lg text-[#22403A]">
            Add Family Member
          </span>
          <span className="text-xs text-[#665F51] mt-1 max-w-[210px]">
            Add a photo, home address for directions, phone number &amp; voice note
          </span>
        </div>
      </div>

      {/* FULL CARD DETAILS & DIRECTIONS MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-rise">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-6 border border-[#E6DAB9]">
            {/* Modal Image Header */}
            <div className="relative h-64 w-full bg-[#22403A]">
              {selectedMember.imageUrl ? (
                <img
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  style={{ backgroundColor: selectedMember.color }}
                  className="w-full h-full flex items-center justify-center text-white"
                >
                  <span className="font-fraunces text-6xl font-bold">{getInitials(selectedMember.name)}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-baloo font-bold text-[#E2A33D] bg-black/50 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedMember.rel}
                </span>
                <h3 className="font-fraunces text-3xl font-bold text-white mt-1">
                  {selectedMember.name}
                </h3>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-4">
              {/* Cherished Memory Quote */}
              <div className="p-4 bg-[#FBF7EE] rounded-2xl border border-[#E6DAB9]/80">
                <span className="text-xs font-baloo font-bold text-[#8A5D18] uppercase tracking-wider block mb-1">
                  Cherished Memory
                </span>
                <p className="text-sm text-[#221F1B] leading-relaxed italic">
                  "{selectedMember.fact}"
                </p>
              </div>

              {/* Directions & Home Address */}
              <div className="p-4 bg-[#E5E9F1]/60 rounded-2xl border border-[#3E4F74]/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-baloo font-bold text-[#3E4F74] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3E4F74]" />
                    Home &amp; Visiting Directions
                  </span>
                  <span className="text-[11px] font-baloo font-bold text-[#3E4F74] bg-[#E5E9F1] px-2 py-0.5 rounded-full">
                    Jorhat Safe Area
                  </span>
                </div>

                <p className="text-sm font-medium text-[#221F1B] mb-2">
                  {selectedMember.address || 'Address registered with family caregiver in Jorhat.'}
                </p>

                <button
                  onClick={() => openDirections(selectedMember)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3E4F74] text-white font-baloo font-bold text-xs hover:bg-[#2F3D5B] transition-colors cursor-pointer shadow-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions to House (Open Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </button>
              </div>

              {/* Voice Greeting Player */}
              <div className="p-4 bg-[#E4ECE7]/70 rounded-2xl border border-[#22403A]/20 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-baloo font-bold text-[#22403A] block mb-0.5">
                    Recorded Voice Note
                  </span>
                  <p className="text-xs text-[#665F51] truncate italic">
                    "{selectedMember.voiceNoteText || 'Namaskar! Thinking of you.'}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => playVoiceNote(selectedMember)}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{playingId === selectedMember.id ? 'Playing…' : 'Play Voice'}</span>
                </button>
              </div>

              {/* Call & Edit Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCallMember(selectedMember)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#BD5B3B] text-white font-baloo font-bold text-sm hover:bg-[#9B482E] transition-colors cursor-pointer shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedMember.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => startEditing(selectedMember)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-[#E6DAB9] text-[#221F1B] hover:bg-[#F1E7CE] font-baloo font-bold text-sm transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FAMILY MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-rise">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl my-8 border border-[#E6DAB9]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-fraunces text-2xl font-medium text-[#221F1B]">
                Edit {editingMember.name}’s Profile
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-full hover:bg-[#F1E7CE] text-[#665F51] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#665F51] mb-5">
              Update photo, visiting address for directions, phone number, and voice greeting.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
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
                    value={editRel}
                    onChange={(e) => setEditRel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
              </div>

              {/* Photo Input & Samples */}
              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="Paste image web link (https://...)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-xs focus:outline-2 focus:outline-[#22403A] mb-2"
                />
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] text-[#948C7A] shrink-0 font-medium">Sample photos:</span>
                  {samplePhotoAvatars.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditImageUrl(sample.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-baloo font-bold shrink-0 transition-colors ${
                        editImageUrl === sample.url
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98640 12345"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                    Home Address (For Directions)
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="e.g. Boruah Chariali, Jorhat"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Cherished Memory
                </label>
                <textarea
                  value={editFact}
                  onChange={(e) => setEditFact(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Spoken Voice Greeting
                </label>
                <input
                  type="text"
                  value={editVoiceNoteText}
                  onChange={(e) => setEditVoiceNoteText(e.target.value)}
                  placeholder="Greeting read aloud when tapping Play Voice"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E6DAB9] font-baloo font-bold text-sm text-[#221F1B] hover:bg-[#F1E7CE] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FAMILY MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-rise">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl my-8 border border-[#E6DAB9]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-fraunces text-2xl font-medium text-[#221F1B]">
                Add to Memory Book
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F1E7CE] text-[#665F51] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#665F51] mb-5">
              Add someone {elderName} holds dear with their photo, visiting address, and voice greeting.
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
                    placeholder="e.g. Ranjit"
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
                    placeholder="e.g. Son / Grandson"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
              </div>

              {/* Photo Input or Quick Select */}
              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image web link (https://...)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-xs focus:outline-2 focus:outline-[#22403A] mb-2"
                />
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] text-[#948C7A] shrink-0 font-medium">Quick sample photos:</span>
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
                    Phone Number
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
                    Home Address (For Directions)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Boruah Chariali, Jorhat"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Cherished Memory
                </label>
                <textarea
                  value={fact}
                  onChange={(e) => setFact(e.target.value)}
                  placeholder="Something warm that triggers joyful recognition"
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1">
                  Spoken Voice Greeting
                </label>
                <input
                  type="text"
                  value={voiceNoteText}
                  onChange={(e) => setVoiceNoteText(e.target.value)}
                  placeholder="Greeting read aloud when tapping Play Voice"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
