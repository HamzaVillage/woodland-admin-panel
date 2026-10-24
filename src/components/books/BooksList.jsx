import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Folder, 
  Headphones, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  GripVertical, 
  Check, 
  X, 
  Plus, 
  Layers, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const BooksList = ({ 
  books = [], 
  isLoading = false, 
  onEditBook, 
  onEditFolder, 
  onDeleteBook, 
  onViewBook, 
  onTogglePublish, 
  onReorder 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const categories = ['All', ...new Set(books.map(b => b.category).filter(Boolean))];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      (book.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      selectedFilter === 'All' ||
      (selectedFilter === 'Published' && book.isPublished) ||
      (selectedFilter === 'Draft' && !book.isPublished) ||
      (selectedFilter === 'E-Books' && book.type === 'ebook' && !book.isFolder) ||
      (selectedFilter === 'Audiobooks' && book.type === 'audiobook') ||
      (selectedFilter === 'Folders' && book.isFolder);

    const matchesCategory = 
      selectedCategory === 'All' || book.category === selectedCategory;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  const canReorder = searchQuery === '' && selectedFilter === 'All' && selectedCategory === 'All';

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...books];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    if (onReorder) {
      onReorder(updated);
    }
  };

  const movePosition = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= books.length) return;

    const updated = [...books];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    if (onReorder) {
      onReorder(updated);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search and Filters Bar */}
      <div className="woodland-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Top Search Line */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-wrapper" style={{ flex: '1', minWidth: '240px' }}>
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search books, authors, series by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div style={{ minWidth: '180px' }}>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '10px 14px' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : `Category: ${cat}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['All', 'Published', 'Draft', 'E-Books', 'Audiobooks', 'Folders'].map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: isSelected ? '#0A1912' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notice for Drag-and-drop Ordering */}
      {canReorder && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(103, 255, 187, 0.05)',
          border: '1px dashed rgba(103, 255, 187, 0.25)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--primary)',
          fontSize: '12px'
        }}>
          <GripVertical size={16} />
          <span>Drag items by the grip handle to reorder how books appear on the mobile app in real-time.</span>
        </div>
      )}

      {/* Books Content Table / List */}
      {isLoading ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div>Loading books and folders...</div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <BookOpen size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#FFFFFF', marginBottom: '6px' }}>No books found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Try changing your search query or filter settings.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredBooks.map((book, index) => {
            return (
              <div
                key={book.id}
                draggable={canReorder}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className="woodland-card book-card-item"
                style={{
                  background: book.isFolder ? 'rgba(137, 31, 255, 0.06)' : 'var(--bg-card)',
                  border: book.isFolder ? '1px solid rgba(137, 31, 255, 0.25)' : '1px solid var(--border-subtle)',
                  opacity: draggedIndex === index ? 0.4 : 1,
                }}
              >
                <div className="book-card-top-row">
                  {/* Drag Handle & Position badge */}
                  {canReorder && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', flexShrink: 0 }} title="Drag to reorder">
                      <span className="hide-mobile" style={{ cursor: 'grab' }}><GripVertical size={20} /></span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button
                          type="button"
                          onClick={() => movePosition(index, -1)}
                          disabled={index === 0}
                          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                          title="Move Up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePosition(index, 1)}
                          disabled={index === books.length - 1}
                          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                          title="Move Down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cover Image / Folder Icon */}
                  <div style={{
                    width: '52px',
                    height: '68px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {book.isFolder ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(137, 31, 255, 0.2)', color: '#C084FC' }}>
                        <Folder size={28} />
                      </div>
                    ) : book.coverImageUrl && book.coverImageUrl !== 'folder' ? (
                      <img 
                        src={book.coverImageUrl} 
                        alt={book.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <BookOpen size={24} color="var(--primary)" />
                    )}

                    {/* Position number pill */}
                    <span style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '2px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '1px 4px',
                      borderRadius: '3px'
                    }}>
                      #{index + 1}
                    </span>
                  </div>

                  {/* Book Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h4 
                        onClick={() => onViewBook(book)}
                        style={{ 
                          fontSize: '15px', 
                          fontWeight: 700, 
                          color: '#FFFFFF', 
                          cursor: 'pointer',
                          wordBreak: 'break-word',
                          lineHeight: 1.2
                        }}
                        title={book.title}
                      >
                        {book.title}
                      </h4>

                      {/* Status Badge */}
                      <button
                        onClick={() => onTogglePublish(book)}
                        className={`badge ${book.isPublished ? 'badge-published' : 'badge-draft'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {book.isPublished ? <Check size={10} /> : <X size={10} />}
                        {book.isPublished ? 'Published' : 'Draft'}
                      </button>

                      {/* Type Badge */}
                      {book.isFolder ? (
                        <span className="badge badge-folder">
                          <Folder size={10} /> Collection ({book.bookIds?.length || 0})
                        </span>
                      ) : book.type === 'audiobook' ? (
                        <span className="badge badge-audio">
                          <Headphones size={10} /> Audio
                        </span>
                      ) : (
                        <span className="badge badge-published" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                          <FileText size={10} /> E-Book
                        </span>
                      )}

                      {book.price > 0 && (
                        <span className="badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                          ${book.price}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>By <strong style={{ color: 'var(--text-secondary)' }}>{book.author || 'Woodland'}</strong></span>
                      <span>•</span>
                      <span>{book.category}</span>
                      {book.language && (
                        <>
                          <span>•</span>
                          <span>{book.language}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="book-card-bottom-actions">
                  <button
                    className="btn-icon"
                    onClick={() => onViewBook(book)}
                    title="View Book Preview"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    className="btn-icon"
                    onClick={() => book.isFolder ? onEditFolder(book) : onEditBook(book)}
                    title="Edit Item"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    className="btn-icon"
                    style={{ color: '#F43F5E' }}
                    onClick={() => onDeleteBook(book)}
                    title="Delete Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
