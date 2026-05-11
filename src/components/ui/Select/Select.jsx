import { useState } from "react";
import styles from './Select.module.css';
import { ArrowForward } from '../../../assets/icons';

const Select = ({ options = [], value, onChange, placeholder = 'Выберите...' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return opt.value === value;
    }
    return opt === value;
  });

  const displayLabel = selectedOption?.label || selectedOption || placeholder;

  const handleSelect = (option) => {
    const finalValue = (typeof option === 'object' && option !== null)
      ? option.value
      : option;

    onChange(finalValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectContainer}>
      <div
        className={`${styles.select} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <ArrowForward className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`} />
      </div>

      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map((option, index) => {
            const label = option.label || option;
            const val = option.value !== undefined ? option.value : option;

            return (
              <li
                key={index}
                className={`${styles.option} ${value === val ? styles.selected : ''}`}
                onClick={() => handleSelect(option)}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;