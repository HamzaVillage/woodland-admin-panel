import React from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Folder, 
  Headphones, 
  Eye, 
  Activity,
  Layers
} from 'lucide-react';

export const StatsGrid = ({ stats, isLoading }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      subValue: `${stats?.adminUsers ?? 0} Admins`,
      icon: <Users size={22} />,
      color: '#38BDF8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
    },
    {
      title: 'Total Books & Folders',
      value: stats?.totalBooks ?? 0,
      subValue: `${stats?.publishedBooks ?? 0} Published`,
      icon: <BookOpen size={22} />,
      color: '#67FFBB',
      bgGlow: 'rgba(103, 255, 187, 0.15)',
    },
    {
      title: 'Published Items',
      value: stats?.publishedBooks ?? 0,
      subValue: `${stats?.draftBooks ?? 0} Drafts`,
      icon: <CheckCircle size={22} />,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
    },
    {
      title: 'Audiobooks',
      value: stats?.audiobooksCount ?? 0,
      subValue: `${stats?.totalListens ?? 0} Listens`,
      icon: <Headphones size={22} />,
      color: '#891FFF',
      bgGlow: 'rgba(137, 31, 255, 0.15)',
    },
    {
      title: 'E-Books & Reading',
      value: stats?.ebooksCount ?? 0,
      subValue: `${stats?.totalReads ?? 0} Total Reads`,
      icon: <Eye size={22} />,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
    },
    {
      title: 'Collections / Folders',
      value: stats?.foldersCount ?? 0,
      subValue: `${stats?.categoriesCount ?? 0} Categories`,
      icon: <Folder size={22} />,
      color: '#C084FC',
      bgGlow: 'rgba(192, 132, 252, 0.15)',
    },
    {
      title: 'Active Today',
      value: stats?.activeToday ?? 0,
      subValue: 'Last 24 hours',
      icon: <Activity size={22} />,
      color: '#F43F5E',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
    },
    {
      title: 'Categories',
      value: stats?.categoriesCount ?? 0,
      subValue: 'Genre taxonomies',
      icon: <Layers size={22} />,
      color: '#2DD4BF',
      bgGlow: 'rgba(45, 212, 191, 0.15)',
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="woodland-card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px 18px',
            background: 'var(--bg-card)'
          }}
        >
          {/* Ambient glow accent */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: card.bgGlow,
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              {card.title}
            </span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: card.bgGlow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: card.color
            }}>
              {card.icon}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}>
              {isLoading ? (
                <span style={{ opacity: 0.4, fontSize: '22px' }}>•••</span>
              ) : (
                card.value
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500 }}>
              {card.subValue}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
