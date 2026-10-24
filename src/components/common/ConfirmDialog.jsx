import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Delete', 
  isDestructive = true,
  isLoading = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="460px">
      <div className="modal-body" style={{ textAlign: 'center', padding: '28px 24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isDestructive ? 'rgba(244, 63, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: isDestructive ? '#F43F5E' : '#FBBF24'
        }}>
          <AlertTriangle size={28} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
          {message}
        </p>
      </div>
      <div className="modal-footer">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className={isDestructive ? 'btn btn-danger' : 'btn btn-primary'} 
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};
