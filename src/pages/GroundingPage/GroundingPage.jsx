import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './GroundingPage.module.css';
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import * as Icons from '../../assets/icons';

const GroundingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const groundingSteps = [
    { title: 'Назовите 5 вещей, которые видите', count: 5, icon: <Icons.Open /> },
    { title: 'Назовите 4 вещи, которые можете потрогать', count: 4, icon: <Icons.Touch /> },
    { title: 'Назовите 3 вещи, которые слышите', count: 3, icon: <Icons.Ear /> },
    { title: 'Назовите 2 вещи, которые чувствуете носом', count: 2, icon: <Icons.Smell /> },
    { title: 'Назовите 1 вещь, которую можете лизнуть', count: 1, icon: <Icons.Taste /> }
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const currentStep = groundingSteps[step];

  const handleCheck = (index) => {
    if (index === checkedCount) {
      const newCount = checkedCount + 1;

      setCheckedCount(newCount);

      if (newCount === currentStep.count) {
        setTimeout(() => {
          if (step < groundingSteps.length - 1) {
            setStep(step + 1);
            setCheckedCount(0);
          } else {
            setIsSuccessModalOpen(true);
          }
        }, 300);
      }
    }
  };

  const restart = () => {
    setStep(0);
    setCheckedCount(0);
    setIsSuccessModalOpen(false);
  };

  const goToHome = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2 className={styles.instruction}>{currentStep.title}</h2>

        <div className={styles.circleContainer}>
          <div className={styles.iconWrapper}>
            {currentStep.icon}
          </div>
        </div>

        <div className={styles.counterGrid}>
          {[...Array(currentStep.count)].map((_, i) => (
            <Button
              key={`${step}-${i}`}
              className={styles.numBtn}
              noBg={i < checkedCount}
              shadowType={i < checkedCount ? null : 's'}
              onClick={() => handleCheck(i)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

      {
        isSuccessModalOpen && (
          <Modal
            onClose={restart}
            childrenData={[
              { name: 'Повторить', onClick: restart },
              { name: 'На главную', onClick: goToHome },
            ]}
          >
            Вы отлично справились!
          </Modal>
        )
      }
    </div>
  );
};

export default GroundingPage;
