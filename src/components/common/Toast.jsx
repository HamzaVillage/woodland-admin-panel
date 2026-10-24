import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#67FFBB" />,
    error: <AlertCircle size={18} color="#F43F5E" />,
    info: <Info size={18} color="#38BDF8" />
  };

  const borderColors = {
    success: 'rgba(103, 255, 187, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    info: 'rgba(56, 189, 248, 0.4)'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      background: 'rgba(23, 32, 39, 0.95)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${borderColors[type] || borderColors.info}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: '500',
      maxWidth: '420px',
      animation: 'slideUp 0.25s ease-out'
    }}>
      {icons[type] || icons.info}
      <span style={{ flex: 1 }}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
