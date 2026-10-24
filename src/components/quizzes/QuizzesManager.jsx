import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  ListChecks,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { quizService } from '../../services/quizService';

export const QuizzesManager = ({ onToast }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    isPublished: true,
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0
      }
    ]
  });
  const [submitting, setSubmitting] = useState(false);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      onToast?.('Failed to load quizzes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const openAddModal = () => {
    setEditingQuiz(null);
    setForm({
      title: '',
      description: '',
      isPublished: true,
      questions: [
        {
          questionText: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0
        }
      ]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setForm({
      title: quiz.title || '',
      description: quiz.description || '',
      isPublished: Boolean(quiz.isPublished),
      questions: Array.isArray(quiz.questions) && quiz.questions.length > 0 
        ? quiz.questions.map(q => ({
            questionText: q.questionText || '',
            options: Array.isArray(q.options) && q.options.length === 4 ? [...q.options] : ['', '', '', ''],
            correctOptionIndex: q.correctOptionIndex ?? 0
          }))
        : [
            {
              questionText: '',
              options: ['', '', '', ''],
              correctOptionIndex: 0
            }
          ]
    });
    setIsModalOpen(true);
  };

  // Dynamic question management
  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0
        }
      ]
    }));
  };

  const removeQuestion = (qIdx) => {
    if (form.questions.length <= 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== qIdx)
    }));
  };

  const updateQuestionText = (qIdx, text) => {
    setForm(prev => {
      const updated = [...prev.questions];
      updated[qIdx] = { ...updated[qIdx], questionText: text };
      return { ...prev, questions: updated };
    });
  };

  const updateOptionText = (qIdx, optIdx, text) => {
    setForm(prev => {
      const updated = [...prev.questions];
      const newOptions = [...updated[qIdx].options];
      newOptions[optIdx] = text;
      updated[qIdx] = { ...updated[qIdx], options: newOptions };
      return { ...prev, questions: updated };
    });
  };

  const setCorrectOption = (qIdx, optIdx) => {
    setForm(prev => {
      const updated = [...prev.questions];
      updated[qIdx] = { ...updated[qIdx], correctOptionIndex: optIdx };
      return { ...prev, questions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a quiz title.');
      return;
    }

    // Validate that questions have text
    for (let i = 0; i < form.questions.length; i++) {
      if (!form.questions[i].questionText.trim()) {
        alert(`Question #${i + 1} is empty.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (editingQuiz) {
        await quizService.updateQuiz(editingQuiz.id, form);
        onToast?.('Quiz updated successfully!', 'success');
      } else {
        await quizService.addQuiz(form);
        onToast?.('Quiz published successfully!', 'success');
      }
      setIsModalOpen(false);
      loadQuizzes();
    } catch (err) {
      onToast?.('Failed to save quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (quiz) => {
    try {
      await quizService.updateQuiz(quiz.id, { isPublished: !quiz.isPublished });
      setQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, isPublished: !q.isPublished } : q));
      onToast?.(`Quiz ${!quiz.isPublished ? 'published' : 'drafted'}`, 'success');
    } catch (err) {
      onToast?.('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await quizService.deleteQuiz(id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      onToast?.('Quiz deleted', 'success');
    } catch (err) {
      onToast?.('Failed to delete quiz', 'error');
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    (q.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.description || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Quizzes List */}
      {isLoading ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div>Loading quizzes...</div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="woodland-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <HelpCircle size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', color: '#FFFFFF', marginBottom: '6px' }}>No Quizzes Available</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Create educational and trivia quizzes for the Woodland readership.
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {filteredQuizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="woodland-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className={`badge ${quiz.isPublished ? 'badge-published' : 'badge-draft'}`}>
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>

                  <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
                    {quiz.questions?.length || 0} Questions
                  </span>
                </div>

                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                  {quiz.title}
                </h4>

                {quiz.description && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {quiz.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => handleToggleStatus(quiz)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: quiz.isPublished ? '#10B981' : '#FBBF24',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {quiz.isPublished ? 'Status: Active' : 'Status: Draft'}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-icon"
                    onClick={() => openEditModal(quiz)}
                    title="Edit Quiz"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="btn-icon"
                    style={{ color: '#F43F5E' }}
                    onClick={() => handleDelete(quiz.id)}
                    title="Delete Quiz"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuiz ? `Edit Quiz: ${editingQuiz.title}` : 'Create New Quiz'}
        maxWidth="740px"
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Quiz Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. The Enchanted Woods Trivia Quiz"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Short description of this quiz..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Questions List */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>
                  Questions ({form.questions.length})
                </h4>
                <button
                  type="button"
                  className="btn btn-purple"
                  onClick={addQuestion}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  <Plus size={14} /> Add Question
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {form.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                        Question #{qIdx + 1}
                      </span>
                      {form.questions.length > 1 && (
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: '#F43F5E', width: '28px', height: '28px' }}
                          onClick={() => removeQuestion(qIdx)}
                          title="Remove question"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      className="form-input"
                      style={{ marginBottom: '12px' }}
                      placeholder="Enter question prompt..."
                      value={q.questionText}
                      onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                      required
                    />

                    <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>
                      Options (Select the correct answer by clicking the radio button):
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctOptionIndex === optIdx;
                        return (
                          <div
                            key={optIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: isCorrect ? 'rgba(103, 255, 187, 0.1)' : 'var(--bg-input)',
                              border: isCorrect ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '6px 10px'
                            }}
                          >
                            <input
                              type="radio"
                              name={`correct-opt-${qIdx}`}
                              checked={isCorrect}
                              onChange={() => setCorrectOption(qIdx, optIdx)}
                              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                            />
                            <input
                              type="text"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#FFFFFF',
                                fontSize: '12px',
                                outline: 'none',
                                width: '100%'
                              }}
                              placeholder={`Option ${optIdx + 1}`}
                              value={opt}
                              onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                              required
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
              <input
                type="checkbox"
                id="publishQuizCheck"
                checked={form.isPublished}
                onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <label htmlFor="publishQuizCheck" style={{ fontSize: '14px', color: '#FFFFFF', cursor: 'pointer' }}>
                Publish quiz immediately
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
              {submitting ? 'Saving...' : (editingQuiz ? 'Save Changes' : 'Publish Quiz')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
