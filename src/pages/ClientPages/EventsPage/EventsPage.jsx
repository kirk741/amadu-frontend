import { useEffect, useState } from 'react';
import List from '../../../components/ui/List/List';
import Modal from '../../../components/ui/Modal/Modal';
import { useEvents } from '../../../hooks/useEvents';
import * as Icons from '../../../assets/icons';
import styles from './EventsPage.module.css';

const EventsPage = () => {
  const { getEvents, pagination, isLoading } = useEvents();

  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const loadPage = async (page, search) => {
    const cleanPage = typeof page === 'string' ? page.replace(/\D/g, '') : page;
    const pageNumber = Number(cleanPage) || 1;
    const result = await getEvents(pageNumber, search);
    setData(result || []);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPage(1, searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const mapEventToCard = (item) => {
    const media = item?.media && item.media.length > 0 ? item.media[0] : null;
    const posterPath = media ? media.file_path : null;
    let posterUrl = null;
    if (posterPath) {
      posterUrl = posterPath.startsWith('http')
        ? posterPath
        : `${process.env.REACT_APP_API_URL}/storage/${posterPath}`;
    }
    const formattedDate = new Date(item.event_date).toLocaleString('ru', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
    return {
      id: item.id,
      imageUrl: posterUrl,
      buttonIcons: [],
      title: item.title,
      description: [
        <span key="ev-cl-1">{item.location}</span>,
        <br key="ev-cl-2" />,
        <span key="ev-cl-3">{formattedDate}</span>
      ]
    };
  };

  const handleOpenDetails = (item) => {
    setActiveItem(item);
    setIsModalOpen(true);
  };

  return (
    <div>
      <List
        items={data || []}
        isLoading={isLoading || data === null}
        mapItem={mapEventToCard}
        onItemClick={(item) => handleOpenDetails(item)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}

        isEmpty={data !== null && !isLoading && data.length === 0}

        pagination={pagination}
        onPageChange={(page) => loadPage(page, searchQuery)}
        emptyComponent={<div>Ближайших мероприятий пока нет. Загляните позже!</div>}
      />

      {isModalOpen && activeItem && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          title={activeItem.title}
          childrenData={[]}
        >
          <div className={styles.modalWrapper}>
            {(() => {
              const media = activeItem?.media && activeItem.media.length > 0 ? activeItem.media[0] : null;
              const posterPath = media ? media.file_path : null;
              const posterUrl = posterPath
                ? (posterPath.startsWith('http') ? posterPath : `${process.env.REACT_APP_API_URL}/storage/${posterPath}`)
                : null;
              if (!posterUrl) return null;
              return (
                <div className={styles.posterContainer}>
                  <img src={posterUrl} alt={activeItem.title} className={styles.posterImage} />
                </div>
              );
            })()}

            <div className={styles.infoBlock}>
              <p className={styles.infoText}>
                Место проведения: <strong>{activeItem.location}</strong>
              </p>
              <p className={styles.infoText}>
                Дата и время:{' '}
                <strong>
                  {new Date(activeItem.event_date).toLocaleString('ru', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </strong>
              </p>
            </div>

            <div className={styles.descriptionBlock}>
              <p className={styles.descriptionText}>
                {activeItem.description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventsPage;
