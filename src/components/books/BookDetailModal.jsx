import React, { useState } from 'react';
import { 
  BookOpen, 
  Headphones, 
  Folder, 
  FileText, 
  ExternalLink, 
  Play, 
  Pause, 
  Clock, 
  DollarSign, 
  Globe, 
  CheckCircle, 
  XCircle,
  Hash
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const BookDetailModal = ({ isOpen, onClose, book, onEdit }) => {
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  if (!book) return null;

  const togglePlay = (url) => {
    if (playingAudioUrl === url) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingAudioUrl(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(url);
      audio.play().catch(e => console.error('Audio play error:', e));
      audio.onended = () => setPlayingAudioUrl(null);
      setAudioElement(audio);
      setPlayingAudioUrl(url);
    }
  };

  const handleModalClose = () => {
    if (audioElement) {
      audioElement.pause();
    }
    setPlayingAudioUrl(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={book.isFolder ? `Collection: ${book.title}` : book.title}
      maxWidth="680px"
    >
      <div className="modal-body">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '24px' }}>
          {/* Cover Art */}
          <div style={{
            width: '120px',
            height: '160px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            {book.isFolder ? (
              <Folder size={48} color="#C084FC" />
            ) : book.coverImageUrl && book.coverImageUrl !== 'folder' ? (
              <img 
                src={book.coverImageUrl} 
                alt={book.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <BookOpen size={40} color="var(--primary)" />
            )}
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span className={`badge ${book.isPublished ? 'badge-published' : 'badge-draft'}`}>
                {book.isPublished ? 'Published' : 'Draft'}
              </span>
              {book.isFolder ? (
                <span className="badge badge-folder">Folder / Collection</span>
              ) : book.type === 'audiobook' ? (
                <span className="badge badge-audio">Audiobook</span>
              ) : (
                <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>E-Book</span>
              )}
              {book.category && (
                <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                  {book.category}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              {book.title}
            </h3>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              By {book.author || 'Woodland'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
              <div style={{ color: 'var(--text-muted)' }}>
                Language: <strong style={{ color: '#FFFFFF' }}>{book.language || 'English'}</strong>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Order Position: <strong style={{ color: '#FFFFFF' }}>#{book.position ?? 0}</strong>
              </div>
              {book.price > 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>
                  Price: <strong style={{ color: '#FBBF24' }}>${book.price}</strong>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  Price: <strong style={{ color: '#34D399' }}>Free</strong>
                </div>
              )}
              {book.readTime > 0 && (
                <div style={{ color: 'var(--text-muted)' }}>
                  Read Time: <strong style={{ color: '#FFFFFF' }}>{book.readTime} mins</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div style={{ marginBottom: '20px' }}>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Description
            </h5>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              {book.description}
            </p>
          </div>
        )}

        {/* E-Book PDF Access */}
        {book.pdfUrl && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={22} color="#F43F5E" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Attached PDF Document</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Digital document reader file</div>
              </div>
            </div>
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <ExternalLink size={14} /> Open PDF
            </a>
          </div>
        )}

        {/* Audiobook Chapters Audio Player */}
        {book.type === 'audiobook' && (
          <div style={{ marginBottom: '16px' }}>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Audio Tracks & Playback Preview
            </h5>

            {Array.isArray(book.chapters) && book.chapters.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {book.chapters.map((chap, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => togglePlay(chap.audioUrl)}
                        disabled={!chap.audioUrl}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: playingAudioUrl === chap.audioUrl ? 'var(--primary)' : 'rgba(137, 31, 255, 0.2)',
                          color: playingAudioUrl === chap.audioUrl ? '#0A1912' : '#C084FC',
                          border: 'none',
                          cursor: chap.audioUrl ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {playingAudioUrl === chap.audioUrl ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{chap.chapterName}</span>
                    </div>

                    {chap.audioUrl && (
                      <a
                        href={chap.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', fontSize: '12px', textDecoration: 'none' }}
                      >
                        Direct Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : book.audioFileUrl ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => togglePlay(book.audioFileUrl)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: playingAudioUrl === book.audioFileUrl ? 'var(--primary)' : 'rgba(103, 255, 187, 0.2)',
                      color: playingAudioUrl === book.audioFileUrl ? '#0A1912' : 'var(--primary)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {playingAudioUrl === book.audioFileUrl ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Main Audio File</span>
                </div>
                <a
                  href={book.audioFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', fontSize: '12px' }}
                >
                  Direct Stream
                </a>
              </div>
            ) : (
              <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>No audio file attached.</div>
            )}
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleModalClose}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            handleModalClose();
            onEdit(book);
          }}
        >
          Edit Book Details
        </button>
      </div>
    </Modal>
  );
};
