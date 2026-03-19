import React from "react";
import styles from "./Button.module.css";

const Button = ({ children, className, noBg = false, shadowType = 's', justifyBetween = false, unactive = false, onClick, type = 'button' }) => {
  const buttonClass = [
    className,
    styles.button,
    noBg ? styles.buttonNoBg : '',
    shadowType === 's' ? styles.buttonHasSShadow : shadowType === 'm' ? styles.buttonHasMShadow : shadowType === 'xl' ? styles.buttonHasXLShadow : '',
    justifyBetween ? styles.buttonJustifyBetween : '',
    unactive ? styles.buttonUnactive : ''
  ].filter(Boolean).join(' ');

  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  )
}

export default Button;