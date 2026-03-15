import React from "react";
import styles from "./Button.module.css";

const Button = ({ children, className = '', hasBg = true, hasShadow = true, justifyBetween = false, type = 'button', onClick }) => {
  const buttonClass = `${styles.button} ${hasBg ? '' : styles.buttonNoBg} ${hasShadow ? styles.buttonHasShadow : ''} ${justifyBetween ? styles.buttonJustifyBetween : ''} ${className}`;
  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;