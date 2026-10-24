import React from 'react';
import { 
  RefreshCw, 
  BookOpen, 
  FolderPlus,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ 
  title = 'Dashboard', 
  onRefresh, 
  isRefreshing, 
  onAddBook, 
  onAddFolder,
  onOpenMobileMenu
}) => {
  const { currentUser } = useAuth();

  return (
    <header className="topbar-header">
      {/* Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Mobile menu trigger */}
        <button 
          className="mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <img 
          src="/app-icon.png" 
          alt="Woodland" 
          style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        />

        <div style={{ minWidth: 0 }}>
          <h1 className="topbar-title">
            {title}
          </h1>
        </div>

        <div className="hide-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(103, 255, 187, 0.1)',
          border: '1px solid rgba(103, 255, 187, 0.25)',
          fontSize: '11px',
          color: 'var(--primary)',
          fontWeight: 600,
          flexShrink: 0
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 6px var(--primary)' }} />
          Online
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {onRefresh && (
          <button 
            className="btn btn-secondary topbar-btn" 
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{ padding: '8px 12px', fontSize: '13px' }}
            title="Reload database"
          >
            <RefreshCw size={15} className={isRefreshing ? 'spinner' : ''} style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}} />
            <span className="hide-mobile">Refresh</span>
          </button>
        )}

        {onAddBook && (
          <button 
            className="btn btn-primary topbar-btn" 
            onClick={onAddBook}
            style={{ padding: '8px 14px', fontSize: '13px' }}
            title="Add New Book"
          >
            <BookOpen size={15} />
            <span className="hide-mobile">Add Book</span>
            <span className="show-mobile-inline">Book</span>
          </button>
        )}

        {onAddFolder && (
          <button 
            className="btn btn-purple topbar-btn" 
            onClick={onAddFolder}
            style={{ padding: '8px 14px', fontSize: '13px' }}
            title="Create New Folder"
          >
            <FolderPlus size={15} />
            <span className="hide-mobile">New Folder</span>
            <span className="show-mobile-inline">Folder</span>
          </button>
        )}
      </div>
    </header>
  );
};
