import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Play, 
  Search,
  Sparkles,
  Layers
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MediaUploader } from '../common/MediaUploader';
import { gameService } from '../../services/gameService';

export const GamesManager = ({ onToast }) => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [previewGame, setPreviewGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    gameUrl: '',
    description: '',
    category: 'Trending',
    isPublished: true
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Trending', 'Puzzle', 'Word Search', 'Matching', 'Action', 'Adventure', 'Arcade'];

  const loadGames = async () => {
    setIsLoading(true);
    try {
      const data = await gameService.getGames();
      setGames(data);
    } catch (err) {
      console.error(err);
      onToast?.('Failed to load games', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const openAddModal = () => {
    setEditingGame(null);
    setForm({
      title: '',
      subtitle: '',
      imageUrl: '',
      gameUrl: '',
      description: '',
      category: 'Trending',
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (game) => {
    setEditingGame(game);
    setForm({
      title: game.title || '',
      subtitle: game.subtitle || '',
      imageUrl: game.imageUrl || '',
      gameUrl: game.gameUrl || '',
      description: game.description || '',
      category: game.category || 'Trending',
      isPublished: Boolean(game.isPublished)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.gameUrl.trim()) {
      alert('Please fill out the game title and game URL.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingGame) {
        await gameService.updateGame(editingGame.id, form);
        onToast?.('Game updated successfully!', 'success');
      } else {
        await gameService.addGame(form);
        onToast?.('Game added successfully!', 'success');
      }
      setIsModalOpen(false);
      loadGames();
    } catch (err) {
      onToast?.('Failed to save game', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (game) => {
    try {
      await gameService.updateGame(game.id, { isPublished: !game.isPublished });
      setGames(prev => prev.map(g => g.id === game.id ? { ...g, isPublished: !g.isPublished } : g));
      onToast?.(`Game ${!game.isPublished ? 'published' : 'drafted'}`, 'success');
    } catch (err) {
      onToast?.('Failed to update game status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game?')) return;
    try {
      await gameService.deleteGame(id);
      setGames(prev => prev.filter(g => g.id !== id));
      onToast?.('Game deleted', 'success');
    } catch (err) {
      onToast?.('Failed to delete game', 'error');
    }
  };

  const filteredGames = games.filter(g => 
    (g.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.category || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Add Game</span>
        </button>
      </div>

      {/* Games Grid */}
      {isLoading ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div>Loading games library...</div>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Gamepad2 size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#FFFFFF', marginBottom: '6px' }}>No Games Added</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Add Unity or HTML5 games for users to play in the mobile app.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredGames.map((game) => (
            <div 
              key={game.id} 
              className="woodland-card"
              style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Game Thumbnail */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#0a0e11',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setPreviewGame(game)}
              >
                {game.imageUrl ? (
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(45, 212, 191, 0.1)', color: '#2DD4BF' }}>
                    <Gamepad2 size={40} />
                  </div>
                )}

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#2DD4BF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0A1912',
                    boxShadow: '0 4px 15px rgba(45, 212, 191, 0.4)'
                  }}>
                    <Play size={18} fill="#0A1912" />
                  </div>
                </div>

                <span style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span className={`badge ${game.isPublished ? 'badge-published' : 'badge-draft'}`}>
                    {game.isPublished ? 'Published' : 'Draft'}
                  </span>
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span className="badge" style={{ background: 'var(--bg-elevated)', color: '#2DD4BF', fontSize: '10px' }}>
                      {game.category}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    {game.title}
                  </h4>

                  {game.subtitle && (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {game.subtitle}
                    </div>
                  )}

                  {game.description && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {game.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => handleToggleStatus(game)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: game.isPublished ? '#10B981' : '#FBBF24',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {game.isPublished ? 'Status: Active' : 'Status: Draft'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-icon"
                      onClick={() => openEditModal(game)}
                      title="Edit Game"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ color: '#F43F5E' }}
                      onClick={() => handleDelete(game.id)}
                      title="Delete Game"
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

      {/* Game Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGame ? `Edit Game: ${editingGame.title}` : 'Add New Game'}
        maxWidth="640px"
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Game Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Woodland Matching Quest"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Memory & Match cards"
                  value={form.subtitle}
                  onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Game Hosted URL (WebGL/HTML5) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://..."
                  value={form.gameUrl}
                  onChange={(e) => setForm(prev => ({ ...prev, gameUrl: e.target.value }))}
                  required
                />
              </div>
            </div>

            <MediaUploader
              label="Game Thumbnail Art"
              value={form.imageUrl}
              onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
              accept="image/*"
              folder="game_thumbnails"
              placeholder="Upload game cover image to Cloudinary"
            />

            <div className="form-group">
              <label className="form-label">Game Instructions & Description</label>
              <textarea
                className="form-textarea"
                placeholder="How to play instructions..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="publishGameCheck"
                checked={form.isPublished}
                onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <label htmlFor="publishGameCheck" style={{ fontSize: '14px', color: '#FFFFFF', cursor: 'pointer' }}>
                Publish immediately in app
              </label>
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
              {submitting ? 'Saving...' : (editingGame ? 'Save Changes' : 'Add Game')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Game Iframe Preview Modal */}
      {previewGame && (
        <Modal
          isOpen={Boolean(previewGame)}
          onClose={() => setPreviewGame(null)}
          title={`Play Preview: ${previewGame.title}`}
          maxWidth="900px"
        >
          <div className="modal-body" style={{ padding: '0' }}>
            <iframe
              src={previewGame.gameUrl}
              title={previewGame.title}
              style={{ width: '100%', height: '540px', border: 'none', background: '#000' }}
              allow="autoplay; fullscreen"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPreviewGame(null)}
            >
              Close Game
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
