import { useGlobalSchedule } from '../../../../context/ScheduleContext';

const Statistics = () => {
  const { slots, bookings } = useGlobalSchedule();
  const now = new Date();

  const pendingCount = bookings.filter(b => b.status === 'scheduled').length;

  const upcomingCount = bookings.filter(b => {
    const isConfirmed = b.status === 'confirmed';
    const isFuture = b.schedule ? new Date(b.schedule.end_time) > now : true;

    return isConfirmed && isFuture;
  }).length;
  
  const freeSlotsCount = slots.filter(s => {
    const isFree = !s.is_booked;
    const isFuture = new Date(s.end_time) > now;
    return isFree && isFuture;
  }).length;

  const rowStyle = {
    fontSize: '15px',
    color: 'var(--title-color, #151E30)',
    marginBottom: '8px',
    fontWeight: '500'
  };

  return (
    <div style={{ padding: '0 var(--s-gap, 16px)', marginTop: '16px' }}>
      <div style={rowStyle}>
        Ожидают ответа: <strong style={{ fontWeight: '600' }}>{pendingCount}</strong>
      </div>
      <div style={rowStyle}>
        Предстоящих записей: <strong style={{ fontWeight: '600' }}>{upcomingCount}</strong>
      </div>
      <div style={rowStyle}>
        Свободных слотов: <strong style={{ fontWeight: '600' }}>{freeSlotsCount}</strong>
      </div>
    </div>
  );
};

export default Statistics;
