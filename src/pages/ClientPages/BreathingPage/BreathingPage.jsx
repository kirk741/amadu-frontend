import { useEffect, useState, useRef } from "react";
import styles from './BreathingPage.module.css';
import Button from "../../../components/ui/Button/Button";

const BreathingPage = () => {
  const [phase, setPhase] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFirstCycle, setIsFirstCycle] = useState(true);
  const canvasRef = useRef(null);

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
      const linearProgress = Math.min(elapsed / duration, 1);

      const progress = 1 - (1 - linearProgress) * (1 - linearProgress);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
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

      const colorValue = getComputedStyle(document.body).getPropertyValue('--title-color').trim();

      ctx.beginPath();
      ctx.strokeStyle = colorValue || (document.body.classList.contains('dark') ? '#ffffff' : '#000000');
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
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
            className={styles.canvas}
            style={{ width: '100%', height: '100%', display: 'block' }}
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
