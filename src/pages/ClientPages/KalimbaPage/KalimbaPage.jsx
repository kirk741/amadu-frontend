import { useEffect, useState, useRef } from "react";
import styles from './KalimbaPage.module.css';
import Modal from "../../../components/ui/Modal/Modal";

const NOTES = [
  { id: 1, key: 'C', freq: 'do', color: 'var(--do-color)' },
  { id: 2, key: 'D', freq: 're', color: 'var(--re-color)' },
  { id: 3, key: 'E', freq: 'mi', color: 'var(--mi-color)' },
  { id: 4, key: 'F', freq: 'fa', color: 'var(--fa-color)' },
  { id: 5, key: 'G', freq: 'sol', color: 'var(--sol-color)' },
  { id: 6, key: 'A', freq: 'la', color: 'var(--la-color)' },
  { id: 7, key: 'B', freq: 'si', color: 'var(--si-color)' },
  { id: 8, key: 'C2', freq: 'do2', color: 'var(--do2-color)' },
];

const KalimbaPage = () => {
  const [activeNotes, setActiveNotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const audioCtx = useRef(null);
  const audioBuffers = useRef({});
  const activeTouches = useRef({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const loadSounds = async () => {
      setIsLoading(true);
      try {
        if (!audioCtx.current) {
          audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        await Promise.all(
          NOTES.map(async (note) => {
            const response = await fetch(`/sounds/${note.freq}.wav`);
            if (!response.ok) throw new Error(`Ошибка загрузки файла для ноты ${note.freq}`);
            const arrayBuffer = await response.arrayBuffer();
            const decodedData = await audioCtx.current.decodeAudioData(arrayBuffer);
            audioBuffers.current[note.id] = decodedData;
          })
        );
      } catch (e) {
        console.error("Ошибка при инициализации или загрузке звуков:", e);
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSounds();

    return () => {
      document.body.style.overflow = 'unset';
      if (audioCtx.current && audioCtx.current.state !== 'closed') {
        audioCtx.current.close();
      }
    };
  }, []);

  const playNote = (note) => {
    if (!audioBuffers.current[note.id]) return;

    if (!audioCtx.current || audioCtx.current.state === 'closed') {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }

    const source = audioCtx.current.createBufferSource();
    const gainNode = audioCtx.current.createGain();

    source.buffer = audioBuffers.current[note.id];
    gainNode.gain.value = 0.6;

    source.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);
    source.start(0);

    source.onended = () => {
      source.disconnect();
      gainNode.disconnect();
    };

    setActiveNotes(prev => ({ ...prev, [note.id]: true }));
    setTimeout(() => setActiveNotes(prev => ({ ...prev, [note.id]: false })), 150);

    if (window.navigator.vibrate) window.navigator.vibrate(15);
  };

  const handleTouch = (e) => {
    if (e.cancelable) e.preventDefault();

    Array.from(e.touches).forEach(touch => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const wrapper = element?.closest(`.${styles.tineWrapper}`);

      if (wrapper) {
        const noteId = parseInt(wrapper.getAttribute('data-id'));
        const touchId = touch.identifier;

        if (activeTouches.current[touchId] !== noteId) {
          const note = NOTES.find(n => n.id === noteId);
          if (note) playNote(note);
          activeTouches.current[touchId] = noteId;
        }
      } else {
        activeTouches.current[touch.identifier] = null;
      }
    });
  };

  const handleTouchEnd = (e) => {
    const currentIdentifiers = Array.from(e.touches).map(t => t.identifier);

    Object.keys(activeTouches.current).forEach(id => {
      if (!currentIdentifiers.includes(parseInt(id))) {
        delete activeTouches.current[id];
      }
    });
  };

  const handleMouseDown = (note) => {
    if ('ontouchstart' in window) return;
    playNote(note);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div
          className={styles.tinesContainer}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {!isLoading && NOTES.map((note) => (
            <div
              key={note.id}
              className={styles.tineWrapper}
              data-id={note.id}
              onMouseDown={() => handleMouseDown(note)}
            >
              <div
                className={`${styles.tine} ${activeNotes[note.id] ? styles.active : ''}`}
                style={{
                  height: `${45 + (note.id * 3.5)}%`,
                  '--active-color': note.color
                }}
              >
                <div className={styles.tineTip} />
                <span className={styles.noteLabel}>{note.key}</span>
              </div>
            </div>
          ))}

          {isLoading && NOTES.map((note) => (
            <div
              key={`${note.id}--unactive`}
              className={styles.tineWrapper}
            >
              <div className={`${styles.skeletonTine} ${styles.tine}`} style={{
                height: `${45 + (note.id * 3.5)}%`
              }}>
                <div className={styles.tineTip} />
                <span className={styles.noteLabel}>{note.key}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>Не удалось загрузить ноты</Modal>
      )}
    </>
  );
};

export default KalimbaPage;
