import * as Icons from '../../../../assets/icons';
import Button from '../../Button/Button';
import styles from './Pagination.module.css';

const Pagination = ({ current, last, onChange }) => {
  const currentNum = Number(current);
  const lastNum = Number(last);

  if (!lastNum || lastNum <= 1) return null;

  const getPages = () => {
    const delta = 1;
    const range = [];
    for (let i = 1; i <= lastNum; i++) {
      if (i === 1 || i === lastNum || (i >= currentNum - delta && i <= currentNum + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  };

  return (
    <div className={styles.pagination}>
      {currentNum > 1 && (
        <Button onClick={() => onChange(currentNum - 1)}>
          <Icons.ArrowBack />
        </Button>
      )}

      {getPages().map((page, idx) => (
        page === '...' ? (
          <span key={`dots-${idx}`} className={styles.dots}>...</span>
        ) : (
          <span
            key={page}
            className={`${styles.page} ${currentNum === page ? styles.activePage : ''}`}
            onClick={() => onChange(page)}
          >
            {page}
          </span>
        )
      ))}

      {currentNum < lastNum && (
        <Button onClick={() => onChange(currentNum + 1)}>
          <Icons.ArrowForward />
        </Button>
      )}
    </div>
  );
};

export default Pagination;