import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useLibrary } from "../../hooks/useLibrary";
import UserSkeleton from "./UserSkeleton/UserSkeleton";
import Container from "../../components/ui/Container/Container";
import Button from '../../components/ui/Button/Button';
import Modal from '../../components/ui/Modal/Modal';
import * as Icons from '../../assets/icons';
import styles from './UserProfilePage.module.css';
import { useEffect, useState } from "react";

const UserProfilePage = () => {
  const { id } = useParams();
  const { user, isLoading: isUserLoading } = useUser(id);
  const { getBooks, pagination, isLoading: isBooksLoading } = useLibrary();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (id) {
      const loadPsychologistBooks = async () => {
        const result = await getBooks(currentPage, '', id);
        setBooks(result || []);
      };
      loadPsychologistBooks();
    }
  }, [id, currentPage]);

  if (isUserLoading) return <Container><UserSkeleton /></Container>;
  if (!user) return <Container>Пользователь не найден</Container>;

  const handlePrevPage = () => {
    if (pagination && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.last) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const userMedia = user?.media && user.media.length > 0 ? user.media[0] : null;
  const userAvatarPath = userMedia ? userMedia.file_path : null;
  const avatarUrl = userAvatarPath
    ? (userAvatarPath.startsWith('http') ? userAvatarPath : `${process.env.REACT_APP_API_URL}/storage/${userAvatarPath}`)
    : null;

  return (
    <>
      <Container>
        <div className={styles.userContainer}>
          <Container className={styles.image_container}>
            {avatarUrl ? (
              <img className={styles.profile_image} src={avatarUrl} alt={user.name} />
            ) : (
              <div className={styles.profile_image} style={{ backgroundColor: '#eee' }} />
            )}
          </Container>
          <div className={styles.userInfoContainer}>
            <h3>{user.name}</h3>
            <small>{user.last_seen_at || 'В сети недавно'}</small>
            <div className={styles.buttonContainer}>
              <Button onClick={() => navigate(`/booking/${user.id}`)}><Icons.Appointment /></Button>
              <Button onClick={() => navigate(`/chat/${user.id}`)}><Icons.Chats /></Button>
            </div>
          </div>
        </div>
        <p className={styles.bio}>{user.bio || 'Описание профиля отсутствует'}</p>


      </Container>
        {books.length > 0 && (
          <div className={styles.booksSection}>
            <h3 className={styles.sectionTitle}>Полезные книги</h3>

            <div className={styles.booksGrid}>
              {books.map((book) => {
                const media = book?.media && book.media.length > 0 ? book.media[0] : null;
                const coverPath = media ? media.file_path : null;
                const coverUrl = coverPath
                  ? (coverPath.startsWith('http') ? coverPath : `${process.env.REACT_APP_API_URL}/storage/${coverPath}`)
                  : null;

                return (
                  <div key={book.id} className={styles.bookCard} onClick={() => setSelectedBook(book)}>
                    <div className={styles.coverWrapper}>
                      {coverUrl && <img src={coverUrl} alt={book.title} className={styles.bookCover} />}
                    </div>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>{book.author}</p>
                  </div>
                );
              })}
            </div>

            {pagination && pagination.last > 1 && (
              <div className={styles.sliderControls}>
                <button
                  className={styles.sliderBtn}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || isBooksLoading}
                >
                  <Icons.ArrowForward style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button
                  className={styles.sliderBtn}
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.last || isBooksLoading}
                >
                  <Icons.ArrowForward />
                </button>
              </div>
            )}
          </div>
        )}
      {
        selectedBook && (
          <Modal
            onClose={() => setSelectedBook(null)}
            title={selectedBook.title}
            childrenData={[{ name: 'Закрыть', onClick: () => setSelectedBook(null) }]}
          >
            <div className={styles.modalContent}>
              <p className={styles.bookMeta}>
                Автор: <strong>{selectedBook.author}</strong>
              </p>
              {selectedBook.comment && (
                <div className={styles.commentSection}>
                  <p className={styles.commentText}>{selectedBook.comment}</p>
                </div>
              )}
            </div>
          </Modal>
        )
      }
    </>
  );
};

export default UserProfilePage;
