import React, { useState, useEffect } from 'react';
import { FolderPlus, BookOpen, Check, X } from 'lucide-react';
import { Modal } from '../common/Modal';

export const FolderFormModal = ({
  isOpen,
  onClose,
  onSave,
  availableBooks = [],
  initialData = null,
  isLoading = false
}) => {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: 'Woodland Collection',
    language: 'English',
    position: 0,
    isPublished: true,
    bookIds: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        author: initialData.author || 'Woodland Collection',
        language: initialData.language || 'English',
        position: initialData.position ?? 0,
        isPublished: Boolean(initialData.isPublished),
        bookIds: Array.isArray(initialData.bookIds) ? [...initialData.bookIds] : []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        author: 'Woodland Collection',
        language: 'English',
        position: 0,
        isPublished: true,
        bookIds: []
      });
    }
  }, [initialData, isOpen]);

  const toggleBookSelection = (bookId) => {
    setFormData(prev => {
      const exists = prev.bookIds.includes(bookId);
      const newBookIds = exists 
        ? prev.bookIds.filter(id => id !== bookId)
        : [...prev.bookIds, bookId];
      return { ...prev, bookIds: newBookIds };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a folder title.');
      return;
    }

    onSave({
      ...formData,
      isFolder: true,
      category: 'Folder',
      coverImageUrl: 'folder',
      position: Number(formData.position) || 0
    });
  };

  // Only non-folder books are selectable
  const eligibleBooks = availableBooks.filter(b => !b.isFolder && b.id !== initialData?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Collection Folder: ${initialData?.title}` : 'Create Collection Folder'}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Folder / Collection Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. The Fairy Tales Series"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Describe this collection or book series..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                className="form-select"
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="French">French</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sorting Position</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
          </div>

          {/* Book Selection List */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Select Books in this Collection ({formData.bookIds.length} selected)
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Click to toggle</span>
            </div>

            <div style={{
              maxHeight: '220px',
              overflowY: 'auto',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '8px'
            }}>
              {eligibleBooks.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                  No standalone books available to add.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {eligibleBooks.map((book) => {
                    const isSelected = formData.bookIds.includes(book.id);
                    return (
                      <div
                        key={book.id}
                        onClick={() => toggleBookSelection(book.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'rgba(137, 31, 255, 0.15)' : 'var(--bg-input)',
                          border: isSelected ? '1px solid rgba(137, 31, 255, 0.4)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: isSelected ? '#891FFF' : 'var(--bg-card)',
                          border: isSelected ? 'none' : '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          {isSelected && <Check size={14} />}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {book.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {book.author} • {book.category}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Publishing Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginTop: '16px'
          }}>
            <input
              type="checkbox"
              id="isFolderPublishedCheck"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              style={{ width: '18px', height: '18px', accentColor: '#891FFF', cursor: 'pointer' }}
            />
            <label htmlFor="isFolderPublishedCheck" style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}>
              Publish this collection immediately
            </label>
          </div>
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
            type="submit"
            className="btn btn-purple"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Folder' : 'Create Folder')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
