import { useState, useEffect } from 'react';
import Input from '../../../../../components/ui/Input/Input';
import Form from '../../../../../components/ui/Form/Form';
import Button from '../../../../../components/ui/Button/Button';
import styles from './SlotGeneratorForm.module.css';

const SlotGeneratorForm = ({ onSave, initialDate = '', editSlot = null }) => {
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [duration, setDuration] = useState(60);
  const [gap, setGap] = useState(15);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (editSlot) {
      const start = new Date(editSlot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const end = new Date(editSlot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStartTime(start);
      setEndTime(end);
    }
  }, [editSlot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (!date) {
      setValidationErrors({ dates: 'Выберите дату' });
      return;
    }

    let payload = {};
    if (editSlot) {
      payload = {
        start_time: `${date} ${startTime}:00`,
        end_time: `${date} ${endTime}:00`
      };
    } else {
      payload = {
        dates: [date],
        start_time: startTime,
        end_time: endTime,
        slot_duration: parseInt(duration),
        gap: parseInt(gap)
      };
    }

    try {
      await onSave(payload);
    } catch (error) {
      if (error) {
        setValidationErrors(error.errors || error);
      }
    }
  };

  const getFieldError = (fieldName) => {
    const err = validationErrors[fieldName];
    return Array.isArray(err) ? err[0] : err;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label="Дата"
        type="date"
        name="dates"
        value={date}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => setDate(e.target.value)}
        disabled
        error={getFieldError('dates') || getFieldError('dates.0')}
      />
      <div className={styles.row}>
        <Input
          label={editSlot ? "Время начала" : "Начало работы"}
          type="time"
          name="start_time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          error={getFieldError('start_time')}
        />
        <Input
          label={editSlot ? "Время окончания" : "Конец работы"}
          type="time"
          name="end_time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          error={getFieldError('end_time')}
        />
      </div>

      {!editSlot && (
        <>
          <Input
            label="Длительность сессии (мин)"
            type="number"
            name="slot_duration"
            min="15"
            max="120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            error={getFieldError('slot_duration')}
          />
          <Input
            label="Перерыв (мин)"
            type="number"
            name="gap"
            min="0"
            max="60"
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            error={getFieldError('gap')}
          />
        </>
      )}

      {(getFieldError('message') || validationErrors.message) && (
        <div style={{ color: '#eb5757', fontSize: '14px', textAlign: 'center', marginBottom: '8px', fontWeight: '500' }}>
          {getFieldError('message') || validationErrors.message}
        </div>
      )}

      <Button type="submit" className={styles.formBtn}>
        {editSlot ? 'Сохранить изменения' : 'Сгенерировать окошки'}
      </Button>
    </Form>
  );
};

export default SlotGeneratorForm;