import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText,
  Menu
} from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenMenu }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'books', label: 'Books', icon: <BookOpen size={19} /> },
    { id: 'users', label: 'Users', icon: <Users size={19} /> },
    { id: 'blogs', label: 'Blogs', icon: <FileText size={19} /> },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* 5th Button: Opens Full Sidebar Drawer */}
      <button
        onClick={onOpenMenu}
        className="mobile-nav-item"
        aria-label="More Navigation Options"
      >
        <Menu size={19} />
        <span>More</span>
      </button>
    </nav>
  );
};
