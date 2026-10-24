import React from 'react';
import { 
  BookPlus, 
  FolderPlus, 
  Video, 
  Music, 
  FilePlus, 
  Gamepad2, 
  HelpCircle,
  Users
} from 'lucide-react';

export const QuickActions = ({ 
  onAddBook, 
  onAddFolder, 
  setActiveTab 
}) => {
  const actions = [
    {
      title: 'Add New Book',
      desc: 'Create e-book or audiobook',
      icon: <BookPlus size={20} />,
      color: '#67FFBB',
      onClick: onAddBook
    },
    {
      title: 'New Folder',
      desc: 'Group books into series',
      icon: <FolderPlus size={20} />,
      color: '#C084FC',
      onClick: onAddFolder
    },
    {
      title: 'Manage Users',
      desc: 'Roles & directory',
      icon: <Users size={20} />,
      color: '#38BDF8',
      onClick: () => setActiveTab('users')
    },
    {
      title: 'Add Video',
      desc: 'YouTube library player',
      icon: <Video size={20} />,
      color: '#F43F5E',
      onClick: () => setActiveTab('media-youtube')
    },
    {
      title: 'Add MP3 Audio',
      desc: 'Direct audio stream tracks',
      icon: <Music size={20} />,
      color: '#891FFF',
      onClick: () => setActiveTab('media-mp3')
    },
    {
      title: 'New Blog Post',
      desc: 'Author app articles',
      icon: <FilePlus size={20} />,
      color: '#FB7185',
      onClick: () => setActiveTab('blogs')
    },
    {
      title: 'Add Unity Game',
      desc: 'Interactive games',
      icon: <Gamepad2 size={20} />,
      color: '#2DD4BF',
      onClick: () => setActiveTab('games')
    },
    {
      title: 'Create Quiz',
      desc: 'Interactive questionnaires',
      icon: <HelpCircle size={20} />,
      color: '#FBBF24',
      onClick: () => setActiveTab('quizzes')
    },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
        Quick Creation & Modules
      </h3>
      <div className="grid-4">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.onClick}
            className="woodland-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              border: '1px solid var(--border-subtle)',
              width: '100%',
              background: 'var(--bg-card)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(103, 255, 187, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: act.color,
              flexShrink: 0
            }}>
              {act.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                {act.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {act.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
