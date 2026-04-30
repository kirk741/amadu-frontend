import { useState } from 'react';
import styles from './Select.module.css';
import { ArrowForward } from '../../../assets/icons';

const Select = ({ options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectContainer}>
      <div 
        className={`${styles.select} ${isOpen ? styles.active : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || 'Выберите тип дневника...'}</span>
        <ArrowForward className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`} />
      </div>

      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map((option, index) => (
            <li 
              key={index} 
              className={styles.option} 
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
