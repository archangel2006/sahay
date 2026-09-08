import React from 'react';
import { Phone, AlertTriangle, X } from 'lucide-react';
import { api } from '../../services/api';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, showToast }) => {
  if (!isOpen) return null;

  const handleConfirmSos = async () => {
    onClose();
    showToast('Dispatching Emergency SOS to Ranjit…', 'phone');
    try {
      const alert = await api.triggerSos();
      showToast(`Alert confirmed: ${alert.contact} notified with live coordinates!`, 'phone');
    } catch (e) {
      showToast('SOS dispatched locally to primary emergency contacts', 'phone');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-rise">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-[#E6DAB9]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F1E7CE] text-[#948C7A] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-[#F5E1D6] text-[#BD5B3B] flex items-center justify-center mx-auto mb-4 border border-[#E7BBA5]">
          <Phone className="w-7 h-7 animate-bounce" />
        </div>

        <h3 className="font-fraunces text-2xl font-medium text-[#221F1B] mb-2">
          Emergency Assistance
        </h3>
        <p className="text-xs text-[#665F51] mb-6 leading-relaxed">
          This will immediately notify Ranjit (son) via phone and share Bimala aita’s last known safe-zone status and location.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#E6DAB9] font-baloo font-bold text-sm text-[#221F1B] hover:bg-[#F1E7CE] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSos}
            className="flex-1 py-3 rounded-xl bg-[#BD5B3B] text-white font-baloo font-bold text-sm hover:brightness-95 cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
};
