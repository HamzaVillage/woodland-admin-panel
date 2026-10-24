import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Headphones, 
  UploadCloud, 
  FileText, 
  Check, 
  Music,
  ListPlus,
  Clock,
  DollarSign
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MediaUploader } from '../common/MediaUploader';

export const BookFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null, 
  isLoading = false 
}) => {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'Fiction',
    type: 'ebook',
    language: 'English',
    position: 0,
    price: 0,
    coverImageUrl: '',
    pdfUrl: '',
    audioFileUrl: '',
    content: '',
    readTime: 10,
    listenTime: 15,
    isPublished: true,
    chapters: []
  });

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Fantasy',
    'Adventure',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Children',
    'Self-Help'
  ];

  const languages = ['English', 'Spanish', 'German', 'Mandarin', 'French', 'Arabic', 'Urdu'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        description: initialData.description || '',
        category: initialData.category || 'Fiction',
        type: initialData.type || 'ebook',
        language: initialData.language || 'English',
        position: initialData.position ?? 0,
        price: initialData.price ?? 0,
        coverImageUrl: initialData.coverImageUrl || '',
        pdfUrl: initialData.pdfUrl || '',
        audioFileUrl: initialData.audioFileUrl || '',
        content: initialData.content || '',
        readTime: initialData.readTime ?? 10,
        listenTime: initialData.listenTime ?? 15,
        isPublished: Boolean(initialData.isPublished),
        chapters: Array.isArray(initialData.chapters) ? [...initialData.chapters] : []
      });
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        category: 'Fiction',
        type: 'ebook',
        language: 'English',
        position: 0,
        price: 0,
        coverImageUrl: '',
        pdfUrl: '',
        audioFileUrl: '',
        content: '',
        readTime: 10,
        listenTime: 15,
        isPublished: true,
        chapters: []
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Audiobook Chapters handling
  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, { chapterName: `Chapter ${prev.chapters.length + 1}`, audioUrl: '' }]
    }));
  };

  const updateChapter = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.chapters];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, chapters: updated };
    });
  };

  const removeChapter = (index) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (publishStatus) => {
    if (!formData.title.trim()) {
      alert('Please enter a book title.');
      return;
    }
    if (!formData.author.trim()) {
      alert('Please enter an author name.');
      return;
    }

    const payload = {
      ...formData,
      isPublished: publishStatus !== undefined ? publishStatus : formData.isPublished,
      price: Number(formData.price) || 0,
      position: Number(formData.position) || 0,
      readTime: Number(formData.readTime) || 0,
      listenTime: Number(formData.listenTime) || 0
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Book: ${initialData?.title}` : 'Add New Book'}
      maxWidth="780px"
    >
      <div className="modal-body">
        {/* Book Type Switcher */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ marginBottom: '10px' }}>Book Format & Type</label>
          <div className="grid-2" style={{ gap: '12px' }}>
            <button
              type="button"
              onClick={() => handleChange('type', 'ebook')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: formData.type === 'ebook' ? 'rgba(103, 255, 187, 0.15)' : 'var(--bg-input)',
                color: formData.type === 'ebook' ? 'var(--primary)' : 'var(--text-secondary)',
                border: formData.type === 'ebook' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <BookOpen size={20} />
              <span>E-Book (Digital Reading & PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => handleChange('type', 'audiobook')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: formData.type === 'audiobook' ? 'rgba(137, 31, 255, 0.18)' : 'var(--bg-input)',
                color: formData.type === 'audiobook' ? '#C084FC' : 'var(--text-secondary)',
                border: formData.type === 'audiobook' ? '2px solid #891FFF' : '1px solid var(--border-subtle)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Headphones size={20} />
              <span>Audiobook (Voice & Sound)</span>
            </button>
          </div>
        </div>

        {/* Section 1: Basic Information */}
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginBottom: '14px' }}>
          Basic Information
        </h4>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Book Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. The Enchanted Woods"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eleanor Vance"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Write a captivating summary of the book..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sorting Position Order</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Media Files */}
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginTop: '16px', marginBottom: '14px' }}>
          Media & Digital Assets
        </h4>

        {/* Cover Image Uploader */}
        <MediaUploader
          label="Cover Image *"
          value={formData.coverImageUrl}
          onChange={(url) => handleChange('coverImageUrl', url)}
          accept="image/*"
          folder="book_covers"
          placeholder="Upload cover image to Cloudinary"
          helperText="PNG, JPG, WebP supported"
        />

        {/* E-Book Specific Uploads */}
        {formData.type === 'ebook' && (
          <>
            <MediaUploader
              label="E-Book PDF File"
              value={formData.pdfUrl}
              onChange={(url) => handleChange('pdfUrl', url)}
              accept=".pdf"
              folder="book_pdfs"
              placeholder="Upload PDF document to Cloudinary"
              helperText="Full book PDF file for the in-app PDF reader"
            />

            <div className="form-group">
              <label className="form-label">Book Content (Plain Text)</label>
              <textarea
                className="form-textarea"
                placeholder="Optional text content for the e-book reader..."
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={4}
              />
            </div>
          </>
        )}

        {/* Audiobook Specific Uploads & Chapters */}
        {formData.type === 'audiobook' && (
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Audio Tracks & Chapters</h5>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Manage multi-chapter audiobook recordings</p>
              </div>
              <button
                type="button"
                className="btn btn-purple"
                onClick={addChapter}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Plus size={14} /> Add Chapter
              </button>
            </div>

            {formData.chapters.length === 0 ? (
              <div style={{ marginBottom: '14px' }}>
                <MediaUploader
                  label="Primary Audio Track (Single File)"
                  value={formData.audioFileUrl}
                  onChange={(url) => handleChange('audioFileUrl', url)}
                  accept="audio/*"
                  folder="audiobooks"
                  placeholder="Upload primary MP3 track"
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formData.chapters.map((chap, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'var(--bg-input)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>#{idx + 1}</span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1, padding: '8px 12px' }}
                      placeholder="Chapter title"
                      value={chap.chapterName}
                      onChange={(e) => updateChapter(idx, 'chapterName', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 2, padding: '8px 12px' }}
                      placeholder="Audio URL (Cloudinary / MP3)"
                      value={chap.audioUrl}
                      onChange={(e) => updateChapter(idx, 'audioUrl', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: '#F43F5E', width: '32px', height: '32px' }}
                      onClick={() => removeChapter(idx)}
                      title="Remove chapter"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timing & Price Information */}
        <div className="grid-3" style={{ marginTop: '14px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Read Time</span>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>minutes</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={formData.readTime}
              onChange={(e) => handleChange('readTime', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Listen Time</span>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>minutes</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={formData.listenTime}
              onChange={(e) => handleChange('listenTime', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Price (USD)</span>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>0 = Free</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>
        </div>

        {/* Publishing Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginTop: '10px'
        }}>
          <input
            type="checkbox"
            id="isPublishedCheck"
            checked={formData.isPublished}
            onChange={(e) => handleChange('isPublished', e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <label htmlFor="isPublishedCheck" style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}>
            Publish this book immediately to the mobile app
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
          type="button"
          className="btn btn-secondary"
          onClick={() => handleSubmit(false)}
          disabled={isLoading}
        >
          Save as Draft
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleSubmit(true)}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish Book')}
        </button>
      </div>
    </Modal>
  );
};
