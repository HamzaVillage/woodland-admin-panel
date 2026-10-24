import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/common/Toast';
import { ConfirmDialog } from './components/common/ConfirmDialog';

// Dashboard components
import { StatsGrid } from './components/dashboard/StatsGrid';
import { UserGrowthChart } from './components/dashboard/UserGrowthChart';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { QuickActions } from './components/dashboard/QuickActions';

// Books & Collections
import { BooksList } from './components/books/BooksList';
import { BookFormModal } from './components/books/BookFormModal';
import { FolderFormModal } from './components/books/FolderFormModal';
import { BookDetailModal } from './components/books/BookDetailModal';

// Other Modules
import { UsersList } from './components/users/UsersList';
import { YoutubeVideosManager } from './components/media/YoutubeVideosManager';
import { Mp3AudioPlayerManager } from './components/media/Mp3AudioPlayerManager';
import { BlogsManager } from './components/blogs/BlogsManager';
import { GamesManager } from './components/games/GamesManager';
import { QuizzesManager } from './components/quizzes/QuizzesManager';

// Services
import { bookService } from './services/bookService';
import { userService } from './services/userService';

export function App() {
  const { isAuthenticated, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data states
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals & Dialogs
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedFolderForEdit, setSelectedFolderForEdit] = useState(null);
  const [detailModalBook, setDetailModalBook] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load core data (Books, Users, Metrics)
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      const [booksData, usersData, statsData] = await Promise.all([
        bookService.getAllBooksAndFolders(),
        userService.getAllUsers(),
        userService.getDashboardStats()
      ]);
      setBooks(booksData);
      setUsers(usersData);
      setDashboardStats(statsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
      showToast('Failed to load latest database data', 'error');
    } finally {
      setIsRefreshing(false);
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Loading Woodland Admin Studio...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Book Handlers
  const handleSaveBook = async (bookData) => {
    setIsSaving(true);
    try {
      if (selectedBookForEdit) {
        await bookService.updateBook(selectedBookForEdit.id, bookData, selectedBookForEdit.collectionType || 'books');
        showToast(`Book "${bookData.title}" updated successfully!`, 'success');
      } else {
        await bookService.addBook(bookData);
        showToast(`Book "${bookData.title}" created successfully!`, 'success');
      }
      setIsBookModalOpen(false);
      setSelectedBookForEdit(null);
      refreshAllData();
    } catch (err) {
      console.error(err);
      showToast('Error saving book: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Folder Handlers
  const handleSaveFolder = async (folderData) => {
    setIsSaving(true);
    try {
      if (selectedFolderForEdit) {
        await bookService.updateBook(selectedFolderForEdit.id, folderData, 'books');
        showToast(`Collection "${folderData.title}" updated successfully!`, 'success');
      } else {
        await bookService.addFolder(folderData);
        showToast(`Collection "${folderData.title}" created successfully!`, 'success');
      }
      setIsFolderModalOpen(false);
      setSelectedFolderForEdit(null);
      refreshAllData();
    } catch (err) {
      console.error(err);
      showToast('Error saving folder: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Published status
  const handleTogglePublish = async (book) => {
    try {
      const updatedStatus = !book.isPublished;
      await bookService.updateBook(book.id, { isPublished: updatedStatus }, book.collectionType || 'books');
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, isPublished: updatedStatus } : b));
      showToast(`"${book.title}" is now ${updatedStatus ? 'Published' : 'Draft'}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Reorder Books
  const handleReorderBooks = async (updatedList) => {
    setBooks(updatedList);
    try {
      await bookService.updatePositions(updatedList);
      showToast('Book display order saved to Firestore!', 'success');
    } catch (err) {
      showToast('Failed to save position order', 'error');
      refreshAllData();
    }
  };

  // Delete Action
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSaving(true);
    try {
      if (itemToDelete.type === 'book') {
        await bookService.deleteBook(itemToDelete.data.id);
        showToast(`"${itemToDelete.data.title}" was deleted.`, 'success');
      } else if (itemToDelete.type === 'user') {
        await userService.deleteUser(itemToDelete.data.id);
        showToast(`User ${itemToDelete.data.name || itemToDelete.data.email} removed.`, 'success');
      }
      setItemToDelete(null);
      refreshAllData();
    } catch (err) {
      showToast('Failed to delete item: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // User Role update
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await userService.updateUser(userId, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast(`User role updated to ${newRole.toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Failed to update user role', 'error');
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Admin Dashboard';
      case 'books': return 'Books & Collections';
      case 'users': return 'User Directory';
      case 'media-youtube': return 'YouTube Library';
      case 'media-mp3': return 'MP3 Audio Library';
      case 'blogs': return 'Blogs & Articles';
      case 'games': return 'Games Studio';
      case 'quizzes': return 'Interactive Quizzes';
      default: return 'Woodland Admin';
    }
  };

  return (
    <div className="admin-layout">
      {/* Toast Alert System */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />

      {/* Responsive Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Application Area */}
      <div className="admin-main-content">
        <Topbar
          title={getPageTitle()}
          onRefresh={refreshAllData}
          isRefreshing={isRefreshing}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onAddBook={() => {
            setSelectedBookForEdit(null);
            setIsBookModalOpen(true);
          }}
          onAddFolder={() => {
            setSelectedFolderForEdit(null);
            setIsFolderModalOpen(true);
          }}
        />

        <main className="content-container">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <StatsGrid stats={dashboardStats} isLoading={isDataLoading} />

              <div className="dashboard-two-col">
                <UserGrowthChart users={users} />
                <RecentActivity books={books} users={users} />
              </div>

              <QuickActions
                onAddBook={() => {
                  setSelectedBookForEdit(null);
                  setIsBookModalOpen(true);
                }}
                onAddFolder={() => {
                  setSelectedFolderForEdit(null);
                  setIsFolderModalOpen(true);
                }}
                setActiveTab={setActiveTab}
              />
            </div>
          )}

          {/* TAB 2: BOOKS & COLLECTIONS */}
          {activeTab === 'books' && (
            <BooksList
              books={books}
              isLoading={isDataLoading}
              onEditBook={(book) => {
                setSelectedBookForEdit(book);
                setIsBookModalOpen(true);
              }}
              onEditFolder={(folder) => {
                setSelectedFolderForEdit(folder);
                setIsFolderModalOpen(true);
              }}
              onDeleteBook={(book) => {
                setItemToDelete({ type: 'book', data: book });
              }}
              onViewBook={(book) => {
                setDetailModalBook(book);
              }}
              onTogglePublish={handleTogglePublish}
              onReorder={handleReorderBooks}
            />
          )}

          {/* TAB 3: USERS */}
          {activeTab === 'users' && (
            <UsersList
              users={users}
              isLoading={isDataLoading}
              onUpdateRole={handleUpdateUserRole}
              onDeleteUser={(u) => {
                setItemToDelete({ type: 'user', data: u });
              }}
            />
          )}

          {/* TAB 4: YOUTUBE VIDEOS */}
          {activeTab === 'media-youtube' && (
            <YoutubeVideosManager onToast={showToast} />
          )}

          {/* TAB 5: MP3 AUDIOS */}
          {activeTab === 'media-mp3' && (
            <Mp3AudioPlayerManager onToast={showToast} />
          )}

          {/* TAB 6: BLOGS */}
          {activeTab === 'blogs' && (
            <BlogsManager onToast={showToast} />
          )}

          {/* TAB 7: GAMES */}
          {activeTab === 'games' && (
            <GamesManager onToast={showToast} />
          )}

          {/* TAB 8: QUIZZES */}
          {activeTab === 'quizzes' && (
            <QuizzesManager onToast={showToast} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Modals & Dialogs */}
      <BookFormModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedBookForEdit(null);
        }}
        onSave={handleSaveBook}
        initialData={selectedBookForEdit}
        isLoading={isSaving}
      />

      <FolderFormModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setSelectedFolderForEdit(null);
        }}
        onSave={handleSaveFolder}
        availableBooks={books}
        initialData={selectedFolderForEdit}
        isLoading={isSaving}
      />

      <BookDetailModal
        isOpen={Boolean(detailModalBook)}
        onClose={() => setDetailModalBook(null)}
        book={detailModalBook}
        onEdit={(book) => {
          if (book.isFolder) {
            setSelectedFolderForEdit(book);
            setIsFolderModalOpen(true);
          } else {
            setSelectedBookForEdit(book);
            setIsBookModalOpen(true);
          }
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={itemToDelete?.type === 'book' ? 'Delete Book / Collection' : 'Delete User'}
        message={itemToDelete?.type === 'book' 
          ? `Are you sure you want to delete "${itemToDelete?.data?.title}"? This cannot be undone.`
          : `Are you sure you want to remove user "${itemToDelete?.data?.name || itemToDelete?.data?.email}"?`
        }
        isLoading={isSaving}
      />
    </div>
  );
}

export default App;
