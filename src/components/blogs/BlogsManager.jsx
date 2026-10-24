import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  User, 
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MediaUploader } from '../common/MediaUploader';
import { blogService } from '../../services/blogService';

export const BlogsManager = ({ onToast }) => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    title: '',
    author: 'Admin',
    content: '',
    imageUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error(err);
      onToast?.('Failed to load blog posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setForm({ title: '', author: 'Admin', content: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || '',
      author: blog.author || 'Admin',
      content: blog.content || '',
      imageUrl: blog.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('Please fill out the title and content.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingBlog) {
        await blogService.updateBlog(editingBlog.id, form);
        onToast?.('Blog article updated successfully!', 'success');
      } else {
        await blogService.addBlog(form);
        onToast?.('Blog article published successfully!', 'success');
      }
      setIsModalOpen(false);
      loadBlogs();
    } catch (err) {
      onToast?.('Failed to save blog post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await blogService.deleteBlog(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
      onToast?.('Blog post deleted', 'success');
    } catch (err) {
      onToast?.('Failed to delete blog post', 'error');
    }
  };

  const filteredBlogs = blogs.filter(b => 
    (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div className="woodland-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ flex: 1, minWidth: '240px' }}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search blogs and articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blogs Grid */}
      {isLoading ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div>Loading articles...</div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FileText size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#FFFFFF', marginBottom: '6px' }}>No Blog Articles</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Publish your first community blog post or announcement.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredBlogs.map((blog) => (
            <div 
              key={blog.id} 
              className="woodland-card"
              style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {blog.imageUrl && (
                <div style={{ width: '100%', height: '160px', overflow: 'hidden', background: '#0a0e11' }}>
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.3 }}>
                    {blog.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
                    {blog.content}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span>By {blog.author}</span>
                    <span>{blog.createdAtDate ? new Date(blog.createdAtDate).toLocaleDateString() : 'Recent'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button
                      className="btn-icon"
                      onClick={() => openEditModal(blog)}
                      title="Edit Article"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ color: '#F43F5E' }}
                      onClick={() => handleDelete(blog.id)}
                      title="Delete Article"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? `Edit Article: ${editingBlog.title}` : 'Write New Article'}
        maxWidth="640px"
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Article Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Exploring The Woodland Series Lore"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author *</label>
              <input
                type="text"
                className="form-input"
                value={form.author}
                onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                required
              />
            </div>

            <MediaUploader
              label="Article Banner Image"
              value={form.imageUrl}
              onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
              accept="image/*"
              folder="blog_images"
              placeholder="Upload cover image to Cloudinary"
            />

            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea
                className="form-textarea"
                placeholder="Write your article content..."
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (editingBlog ? 'Save Changes' : 'Publish Article')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
