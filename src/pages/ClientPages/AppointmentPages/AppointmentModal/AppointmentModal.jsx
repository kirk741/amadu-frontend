import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/ui/Modal/Modal";
import { useMyBookings } from "../../../../hooks/useMyBookings";

const AppointmentModal = ({ isModalOpen, status, setIsModalOpen, setStatus, data }) => {
  const navigate = useNavigate();
  const { cancelAppointment } = useMyBookings();

  return (
    <Modal
      onClose={() => {
        setIsModalOpen(false);
        setStatus('');
        if (status === true) navigate('/appointments');
      }}
      childrenData={
        status === true
          ? [{ name: 'Понятно', onClick: () => navigate('/appointments') }]
          : status === false
            ? [{ name: 'Назад', onClick: () => setStatus('') }]
            : [
              {
                name: 'Подтвердить отмену',
                preventClose: true,
                onClick: async () => {
                  try {
                    await cancelAppointment(data.id);
                    setStatus(true);
                  } catch (e) {
                    setStatus(false);
                  }
                }
              }
            ]
      }
    >
      {status === true && (
        <div>
          <span>Запись успешно отменена.</span>
        </div>
      )}

      {status === false && (
        <div>
          <span>Не удалось отменить запись. Возможно, она уже отменена.</span>
        </div>
      )}

      {status === '' && <span>Вы действительно хотите отменить запись?</span>}
    </Modal>
  )
}

export default AppointmentModal;