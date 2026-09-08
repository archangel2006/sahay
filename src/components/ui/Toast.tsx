import React from 'react';
import { Check, AlertCircle, Info, Phone, Play } from 'lucide-react';

interface ToastProps {
  message: string | null;
  iconType?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, iconType }) => {
  if (!message) return null;

  const renderIcon = () => {
    switch (iconType) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-[#E2A33D]" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-[#E2A33D]" />;
      case 'play':
        return <Play className="w-4 h-4 text-[#E2A33D]" />;
      case 'check':
      default:
        return <Check className="w-4 h-4 text-[#E2A33D]" />;
    }
  };

  return (
    <div className="fixed bottom-16 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#152B26] text-[#FBF7EE] px-5 py-3 rounded-full font-baloo font-semibold text-xs md:text-sm shadow-xl flex items-center gap-2.5 z-50 animate-rise pointer-events-none border border-white/10">
      {renderIcon()}
      <span>{message}</span>
    </div>
  );
};
