import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Video, 
  Music, 
  FileText, 
  Gamepad2, 
  HelpCircle, 
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen = false, onClose }) => {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'books', label: 'Books & Library', icon: <BookOpen size={19} /> },
    { id: 'users', label: 'Users Directory', icon: <Users size={19} /> },
    { id: 'media-youtube', label: 'YouTube Videos', icon: <Video size={19} /> },
    { id: 'media-mp3', label: 'MP3 Audios', icon: <Music size={19} /> },
    { id: 'blogs', label: 'Blogs & Articles', icon: <FileText size={19} /> },
    { id: 'games', label: 'Games Library', icon: <Gamepad2 size={19} /> },
    { id: 'quizzes', label: 'Quizzes', icon: <HelpCircle size={19} /> },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`mobile-drawer-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar (Desktop fixed + Mobile slide-over drawer) */}
      <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/app-icon.png" 
              alt="Woodland Logo" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(103, 255, 187, 0.35)',
                objectFit: 'cover'
              }}
            />
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                WOODLAND
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Admin Studio
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="btn-icon"
              style={{ display: isOpen ? 'inline-flex' : 'none' }}
              aria-label="Close Menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav Menu Items */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 12px 4px 12px' }}>
            Management
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(103, 255, 187, 0.12)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(103, 255, 187, 0.25)' : '1px solid transparent',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    boxShadow: '0 0 8px var(--primary)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout Footer */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(18, 24, 29, 0.6)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
            padding: '8px',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)'
          }}>
            {currentUser?.profileImageUrl ? (
              <img 
                src={currentUser.profileImageUrl} 
                alt="Avatar" 
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px'
              }}>
                {(currentUser?.name || 'A')[0]}
              </div>
            )}
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.email || 'admin@glennverse.com'}
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="btn btn-danger"
            style={{ width: '100%', fontSize: '13px', padding: '8px 12px' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};
