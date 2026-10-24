import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Volume2, 
  Search, 
  ExternalLink,
  Check,
  X,
  Disc3
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MediaUploader } from '../common/MediaUploader';
import { mediaService } from '../../services/mediaService';

export const Mp3AudioPlayerManager = ({ onToast }) => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio playback state
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [audioInstance, setAudioInstance] = useState(null);

  const [form, setForm] = useState({
    title: '',
    url: '',
    isPublished: true
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTracks = async () => {
    setIsLoading(true);
    try {
      const data = await mediaService.getMp3s();
      setTracks(data);
    } catch (err) {
      console.error(err);
      onToast?.('Failed to load MP3 tracks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTracks();
    return () => {
      if (audioInstance) {
        audioInstance.pause();
      }
    };
  }, []);

  const toggleAudio = (track) => {
    if (currentPlayingId === track.id) {
      if (audioInstance) {
        audioInstance.pause();
      }
      setCurrentPlayingId(null);
    } else {
      if (audioInstance) {
        audioInstance.pause();
      }
      const audio = new Audio(track.url);
      audio.play().catch(e => {
        console.error('Audio playback error:', e);
        onToast?.('Failed to play audio stream', 'error');
      });
      audio.onended = () => setCurrentPlayingId(null);
      setAudioInstance(audio);
      setCurrentPlayingId(track.id);
    }
  };

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      alert('Please enter track title and upload an audio file.');
      return;
    }

    setSubmitting(true);
    try {
      await mediaService.addMp3(form);
      onToast?.('MP3 track added successfully!', 'success');
      setIsAddModalOpen(false);
      setForm({ title: '', url: '', isPublished: true });
      loadTracks();
    } catch (err) {
      onToast?.('Failed to add MP3', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (track) => {
    try {
      await mediaService.updateMp3Status(track.id, !track.isPublished);
      setTracks(prev => prev.map(t => t.id === track.id ? { ...t, isPublished: !t.isPublished } : t));
      onToast?.(`Track ${!track.isPublished ? 'published' : 'drafted'}`, 'success');
    } catch (err) {
      onToast?.('Failed to update status', 'error');
    }
  };

  const handleDeleteTrack = async (id) => {
    if (!window.confirm('Delete this MP3 audio track?')) return;
    try {
      if (currentPlayingId === id && audioInstance) {
        audioInstance.pause();
        setCurrentPlayingId(null);
      }
      await mediaService.deleteMp3(id);
      setTracks(prev => prev.filter(t => t.id !== id));
      onToast?.('Track deleted', 'success');
    } catch (err) {
      onToast?.('Failed to delete track', 'error');
    }
  };

  const filteredTracks = tracks.filter(t => 
    (t.title || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search MP3 audio tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Upload New MP3</span>
        </button>
      </div>

      {/* Track List */}
      {isLoading ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div>Loading MP3 sound library...</div>
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Music size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#FFFFFF', marginBottom: '6px' }}>No MP3 Tracks Available</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Upload MP3 sound files to make them available in the Woodland audio stream library.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTracks.map((track, idx) => {
            const isPlaying = currentPlayingId === track.id;
            return (
              <div 
                key={track.id}
                className="woodland-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 18px',
                  gap: '16px',
                  background: isPlaying ? 'rgba(103, 255, 187, 0.08)' : 'var(--bg-card)',
                  border: isPlaying ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Play Button */}
                <button
                  onClick={() => toggleAudio(track)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: isPlaying ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: isPlaying ? '#0A1912' : 'var(--primary)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isPlaying ? '0 0 15px rgba(103, 255, 187, 0.4)' : 'none',
                    flexShrink: 0
                  }}
                  title={isPlaying ? 'Pause' : 'Play Preview'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                </button>

                {/* Track Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </h4>
                    <span className={`badge ${track.isPublished ? 'badge-published' : 'badge-draft'}`}>
                      {track.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '500px' }}>
                    {track.url}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleToggleStatus(track)}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    {track.isPublished ? 'Draft' : 'Publish'}
                  </button>

                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon"
                    title="Direct URL"
                  >
                    <ExternalLink size={15} />
                  </a>

                  <button
                    className="btn-icon"
                    style={{ color: '#F43F5E' }}
                    onClick={() => handleDeleteTrack(track.id)}
                    title="Delete Track"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add MP3 Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload MP3 Audio Track"
        maxWidth="560px"
      >
        <form onSubmit={handleAddTrack}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Track Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Woodland Ambient Soundscape"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <MediaUploader
              label="Audio File (MP3 / WAV / M4A) *"
              value={form.url}
              onChange={(url) => setForm(prev => ({ ...prev, url }))}
              accept="audio/*"
              folder="mp3_library"
              placeholder="Click or drag MP3 audio to upload to Cloudinary"
              helperText="Files will be uploaded and stored securely"
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="publishMp3Check"
                checked={form.isPublished}
                onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <label htmlFor="publishMp3Check" style={{ fontSize: '14px', color: '#FFFFFF', cursor: 'pointer' }}>
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
              {submitting ? 'Saving...' : 'Add Track'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
