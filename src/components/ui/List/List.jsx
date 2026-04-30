import Input from '../Input/Input';
import styles from './List.module.css';
import CardSkeleton from './CardSkeleton/CardSkeleton';
import Pagination from './Pagination/Pagination';
import FloatButtons from './FloatButtons/FloatButtons';
import Card from './Card/Card';
import { useEffect } from 'react';

const List = ({
  items = [],
  mapItem,
  onItemBtnClick,
  onItemClick,
  children,
  searchQuery,
  setSearchQuery,
  isLoading,
  isEmpty,
  emptyComponent,
  pagination,
  onPageChange,
  actions = []
}) => {
  const showSearch = setSearchQuery && (isLoading || items.length > 0 || searchQuery);
  
  const handlePageChange = (page) => {
    window.scrollTo(0, 0);
    onPageChange(page);
  };

  return (
    <div className={styles.list}>
      {showSearch && (
        <Input
          className={styles.search}
          type="search"
          placeholder='Поиск...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      {isLoading ? (
        [1, 2, 3].map((n) => <CardSkeleton key={n} />)
      ) : isEmpty ? (
        searchQuery ? <div className={styles.noResults}>Ничего не найдено</div> : emptyComponent
      ) : (
        <>
          {items.map((item, index) => {
            const cardProps = mapItem(item);

            return (
              <Card
                key={cardProps.id || index}
                {...cardProps}
                btnOnClick={(e) => {
                  e.stopPropagation();
                  onItemBtnClick(item);
                }}
                onClick={() => onItemClick(item)}
              />
            );
          })}

          {pagination && <Pagination {...pagination} onChange={handlePageChange} />}
        </>
      )}

      <FloatButtons actions={actions} />
      {children}
    </div>
  );
};

export default List;