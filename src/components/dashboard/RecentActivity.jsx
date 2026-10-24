import React from 'react';
import { Clock, BookOpen, UserCheck, Sparkles, FolderPlus, Radio } from 'lucide-react';

export const RecentActivity = ({ books = [], users = [] }) => {
  // Synthesize recent activities from actual Firestore items
  const bookActivities = books.slice(0, 3).map(book => ({
    id: `book-${book.id}`,
    icon: <BookOpen size={16} color="var(--primary)" />,
    bg: 'rgba(103, 255, 187, 0.12)',
    title: book.title,
    action: book.isFolder ? 'Updated collection folder' : (book.isPublished ? 'Published book' : 'Drafted book'),
    time: book.updatedAtDate ? new Date(book.updatedAtDate).toLocaleDateString() : 'Recently'
  }));

  const userActivities = users.slice(0, 2).map(user => ({
    id: `user-${user.id}`,
    icon: <UserCheck size={16} color="#38BDF8" />,
    bg: 'rgba(56, 189, 248, 0.12)',
    title: user.name || user.email,
    action: 'Registered on Woodland App',
    time: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'
  }));

  const activities = [...bookActivities, ...userActivities];

  return (
    <div className="woodland-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Recent Activity Feed</h3>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Live logs</span>
      </div>

      {activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)', fontSize: '13px' }}>
          No recent activity found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activities.map((act) => (
            <div 
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: act.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {act.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {act.action}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                {act.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
