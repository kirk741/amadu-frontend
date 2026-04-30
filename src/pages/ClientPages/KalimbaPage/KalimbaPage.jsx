import { useEffect, useState, useRef } from "react";
import styles from './KalimbaPage.module.css';

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
  const lastPlayedId = useRef(null);
  const audioCtx = useRef(null);
  const audioBuffers = useRef({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();

    const loadSounds = async () => {
      for (const note of NOTES) {
        try {
          const response = await fetch(`/sounds/${note.freq}.wav`);
          const arrayBuffer = await response.arrayBuffer();
          const decodedData = await audioCtx.current.decodeAudioData(arrayBuffer);
          audioBuffers.current[note.id] = decodedData;
        } catch (e) {
          console.error(`Ошибка загрузки: ${note.freq}`, e);
        }
      }
    };
    loadSounds();
    return () => {
      document.body.style.overflow = 'unset';
      if (audioCtx.current) audioCtx.current.close();
    };
  }, []);

  const playNote = (note) => {
    if (!audioBuffers.current[note.id] || !audioCtx.current) return;
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();

    const source = audioCtx.current.createBufferSource();
    const gainNode = audioCtx.current.createGain();
    source.buffer = audioBuffers.current[note.id];
    gainNode.gain.value = 0.6;
    source.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);
    source.start(0);

    setActiveNotes(prev => ({ ...prev, [note.id]: true }));
    setTimeout(() => setActiveNotes(prev => ({ ...prev, [note.id]: false })), 150);
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  const handleTouch = (e) => {
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const wrapper = element?.closest(`.${styles.tineWrapper}`);

    if (wrapper) {
      const noteId = parseInt(wrapper.getAttribute('data-id'));
      if (lastPlayedId.current !== noteId) {
        const note = NOTES.find(n => n.id === noteId);
        if (note) playNote(note);
        lastPlayedId.current = noteId;
      }
    } else {
      lastPlayedId.current = null;
    }
  };

  const handleMouseDown = (note) => {
    if ('ontouchstart' in window) return;
    playNote(note);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.tinesContainer}
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
        onTouchEnd={() => { lastPlayedId.current = null; }}
      >
        {NOTES.map((note) => (
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
              <span className={styles.noteLabel}>{note.key}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KalimbaPage;
