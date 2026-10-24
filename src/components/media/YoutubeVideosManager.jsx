import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  Play, 
  Search, 
  Video 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { mediaService } from '../../services/mediaService';

export const YoutubeVideosManager = ({ onToast }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    videoId: '',
    title: '',
    description: '',
    isPublished: true
  });
  const [submitting, setSubmitting] = useState(false);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const data = await mediaService.getYoutubeVideos();
      setVideos(data);
    } catch (err) {
      console.error(err);
      onToast?.('Failed to load YouTube videos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!form.videoId.trim() || !form.title.trim()) {
      alert('Please provide Video ID and Title.');
      return;
    }

    // Extract videoId if user pasted full YouTube URL
    let cleanId = form.videoId.trim();
    if (cleanId.includes('watch?v=')) {
      cleanId = cleanId.split('watch?v=')[1]?.split('&')[0] || cleanId;
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1]?.split('?')[0] || cleanId;
    }

    setSubmitting(true);
    try {
      await mediaService.addYoutubeVideo({
        ...form,
        videoId: cleanId
      });
      onToast?.('YouTube video added successfully!', 'success');
      setIsAddModalOpen(false);
      setForm({ videoId: '', title: '', description: '', isPublished: true });
      loadVideos();
    } catch (err) {
      console.error(err);
      onToast?.('Failed to add video', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (video) => {
    try {
      await mediaService.updateVideoStatus(video.id, !video.isPublished);
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, isPublished: !v.isPublished } : v));
      onToast?.(`Video ${!video.isPublished ? 'published' : 'drafted'}`, 'success');
    } catch (err) {
      onToast?.('Failed to update status', 'error');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to remove this video?')) return;
    try {
      await mediaService.deleteYoutubeVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
      onToast?.('Video removed successfully', 'success');
    } catch (err) {
      onToast?.('Failed to delete video', 'error');
    }
  };

  const filteredVideos = videos.filter(v => 
    (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.description || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search YouTube videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add YouTube Video</span>
        </button>
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div>Loading YouTube videos...</div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Video size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#FFFFFF', marginBottom: '6px' }}>No YouTube Videos</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Add videos to make them available in the Woodland media screen.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="woodland-card"
              style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Video Thumbnail */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#0a0e11',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setPreviewVideo(video)}
              >
                <img
                  src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#F43F5E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(244, 63, 94, 0.5)'
                  }}>
                    <Play size={20} fill="#FFFFFF" />
                  </div>
                </div>

                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 2
                }}>
                  <span className={`badge ${video.isPublished ? 'badge-published' : 'badge-draft'}`}>
                    {video.isPublished ? 'Published' : 'Draft'}
                  </span>
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.3 }}>
                    {video.title}
                  </h4>
                  {video.description && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {video.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => handleToggleStatus(video)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: video.isPublished ? '#10B981' : '#FBBF24',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {video.isPublished ? 'Status: Active' : 'Status: Draft'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      title="Open on YouTube"
                    >
                      <ExternalLink size={15} />
                    </a>
                    <button
                      className="btn-icon"
                      style={{ color: '#F43F5E' }}
                      onClick={() => handleDeleteVideo(video.id)}
                      title="Delete Video"
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

      {/* Add Video Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add YouTube Video"
        maxWidth="540px"
      >
        <form onSubmit={handleAddVideo}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">YouTube Video ID or Link *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                value={form.videoId}
                onChange={(e) => setForm(prev => ({ ...prev, videoId: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Video Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. The Magic Forest Animation"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Short video description..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="publishVideoCheck"
                checked={form.isPublished}
                onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <label htmlFor="publishVideoCheck" style={{ fontSize: '14px', color: '#FFFFFF', cursor: 'pointer' }}>
                Publish immediately in app
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Add Video'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Player Modal */}
      {previewVideo && (
        <Modal
          isOpen={Boolean(previewVideo)}
          onClose={() => setPreviewVideo(null)}
          title={previewVideo.title}
          maxWidth="800px"
        >
          <div className="modal-body" style={{ padding: '0' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
              <iframe
                src={`https://www.youtube.com/embed/${previewVideo.videoId}?autoplay=1`}
                title={previewVideo.title}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPreviewVideo(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
