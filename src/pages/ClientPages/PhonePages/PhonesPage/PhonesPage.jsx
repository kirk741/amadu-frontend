import { useSupport } from "../../../../hooks/useSupport";
import List from "../../../../components/ui/List/List";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../../../../components/ui/Modal/Modal";

const PhonesPage = () => {
  const navigate = useNavigate();
  const { phones, pagination, isLoading, searchQuery, setSearchQuery, refresh } = useSupport();
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMenu = (phone) => {
    setSelectedPhone(phone);
    setIsModalOpen(true);
  };

  return (
    <List
      items={phones}
      isLoading={isLoading}
      isEmpty={phones.length === 0}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      pagination={pagination}
      onPageChange={refresh}
      mapItem={(item) => ({
        id: item.id,
        type: 'phone',
        title: item.title,
        description: item.phone,
        content: item.description
      })}
      onItemClick={(item) => {
        navigate(`/phone/${item.id}`);
      }}
      onItemBtnClick={openMenu}
    >
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={[
            {
              name: 'Подробнее',
              onClick: () => navigate(`/phone/${selectedPhone.id}`)
            },
            {
              name: 'Позвонить',
              onClick: () => window.location.href = `tel: ${selectedPhone.phone.replace(/[^0-9+]/g, '')}`
            }
          ]}
        >
          {selectedPhone?.title}
        </Modal>
      )}
    </List>
  );
};

export default PhonesPage;