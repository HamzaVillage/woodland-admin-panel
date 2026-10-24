import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  Edit, 
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const UsersList = ({ 
  users = [], 
  isLoading = false, 
  onUpdateRole, 
  onDeleteUser 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phoneNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = 
      roleFilter === 'All' ||
      (roleFilter === 'Admins' && u.role === 'admin') ||
      (roleFilter === 'Users' && u.role !== 'admin');

    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Filter Header */}
      <div className="woodland-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '240px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search users by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Users', 'Admins'].map((tab) => {
              const isSelected = roleFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setRoleFilter(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: isSelected ? '#0A1912' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Users Table / Grid */}
      {isLoading ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div>Loading user accounts...</div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#FFFFFF', marginBottom: '6px' }}>No users found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            There are no registered users matching your criteria.
          </p>
        </div>
      ) : (
        <div className="woodland-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>User</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Contact Info</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Role</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Registered</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr 
                      key={u.id}
                      style={{ 
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Name & Avatar */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {u.profileImageUrl ? (
                            <img 
                              src={u.profileImageUrl} 
                              alt={u.name} 
                              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: isAdmin 
                                ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                                : 'linear-gradient(135deg, #38BDF8, #1E40AF)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isAdmin ? '#0A1912' : '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '14px'
                            }}>
                              {(u.name || 'U')[0].toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                              {u.name || 'Anonymous User'}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                              ID: {u.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{u.email}</span>
                          {u.phoneNumber && (
                            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{u.phoneNumber}</span>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          onClick={() => onUpdateRole(u.id, isAdmin ? 'user' : 'admin')}
                          className={`badge ${isAdmin ? 'badge-admin' : 'badge-draft'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle user/admin role"
                        >
                          {isAdmin ? <ShieldCheck size={11} /> : <User size={11} />}
                          {isAdmin ? 'Administrator' : 'Standard User'}
                        </button>
                      </td>

                      {/* Date Joined */}
                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="btn-icon"
                            onClick={() => setSelectedUser(u)}
                            title="View User Details"
                          >
                            <User size={15} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: '#F43F5E' }}
                            onClick={() => onDeleteUser(u)}
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <Modal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title="User Profile Details"
          maxWidth="520px"
        >
          <div className="modal-body">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {selectedUser.profileImageUrl ? (
                <img 
                  src={selectedUser.profileImageUrl} 
                  alt={selectedUser.name} 
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto' }}
                />
              ) : (
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '24px',
                  margin: '0 auto 12px auto'
                }}>
                  {(selectedUser.name || 'U')[0]}
                </div>
              )}

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                {selectedUser.name || 'Anonymous User'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {selectedUser.email}
              </p>
            </div>

            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>User ID:</span>
                <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{selectedUser.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                <span style={{ color: '#FFFFFF' }}>{selectedUser.phoneNumber || 'Not provided'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Access Level:</span>
                <span style={{ color: selectedUser.role === 'admin' ? 'var(--primary)' : '#FFFFFF', fontWeight: 700 }}>
                  {selectedUser.role?.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Joined:</span>
                <span style={{ color: '#FFFFFF' }}>
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
            <button
              type="button"
              className={selectedUser.role === 'admin' ? 'btn btn-secondary' : 'btn btn-primary'}
              onClick={() => {
                onUpdateRole(selectedUser.id, selectedUser.role === 'admin' ? 'user' : 'admin');
                setSelectedUser(null);
              }}
            >
              {selectedUser.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
