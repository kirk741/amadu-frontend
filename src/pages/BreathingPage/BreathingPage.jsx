import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from './BreathingPage.module.css';
import Button from "../../components/common/Button/Button";
import * as Icons from '../../assets/icons';

const BreathingPage = () => {
  const [phase, setPhase] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFirstCycle, setIsFirstCycle] = useState(true);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const phases = ['Вдох', 'Держим', 'Выдох', 'Держим'];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    let startTime = null;
    const duration = 4000;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // ХАК ДЛЯ HD КАЧЕСТВА:
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Устанавливаем размер буфера равным физическим пикселям экрана
      if (canvas.width !== rect.width * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr); // Масштабируем контекст обратно
      }

      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const midY = height / 2;
      const maxBending = 120;
      let currentBending = 0;

      if (phase === 0) {
        currentBending = isFirstCycle ? -(progress * maxBending) : maxBending - (progress * maxBending * 2);
      } else if (phase === 1) {
        currentBending = -maxBending;
      } else if (phase === 2) {
        currentBending = -maxBending + (progress * maxBending * 2);
      } else if (phase === 3) {
        currentBending = maxBending;
      }

      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#333';

      ctx.beginPath();
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      // Сглаживание линии
      ctx.lineJoin = 'round';

      ctx.moveTo(0, midY);
      ctx.quadraticCurveTo(width / 2, midY + currentBending, width, midY);
      ctx.stroke();

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        startTime = null;
        if (phase === 3 && isFirstCycle) setIsFirstCycle(false);
        setPhase((prev) => (prev + 1) % 4);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, phase, isFirstCycle]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      setPhase(0);
      setIsFirstCycle(true);
    } else {
      setIsActive(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.statusText}>
        {isActive ? phases[phase] : 'Нажмите старт'}
      </div>

      <div className={styles.circleContainer}>
        {!isActive ? (
          <div className={styles.idleLine} />
        ) : (
          <canvas
            ref={canvasRef}
            // Убираем фиксированные width/height, будем брать из CSS
            style={{ width: '100%', height: '100%' }}
            className={styles.canvas}
          />
        )}
      </div>

      <div className={styles.controls}>
        <Button className={styles.mainBtn} onClick={toggleTimer}>
          {isActive ? 'Стоп' : 'Старт'}
        </Button>
      </div>
    </div>
  );
};

export default BreathingPage;
