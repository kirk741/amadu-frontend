import { useSupport } from "../../../../hooks/useSupport";
import List from "../../../../components/ui/List/List";
import { useState } from "react";
import Modal from "../../../../components/ui/Modal/Modal";
import PhoneDetailsPage from "../PhoneDetailsPage/PhoneDetailsPage";

const PhonesPage = () => {
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
      onItemClick={openMenu}
      onItemBtnClick={openMenu}
    >
      {isModalOpen && selectedPhone && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPhone(null);
          }}
          childrenData={[
            {
              name: 'Позвонить',
              onClick: () => {
                const cleanPhone = selectedPhone.phone.replace(/[^0-9+]/g, '');
                window.location.href = `tel:${cleanPhone}`;
              }
            }
          ]}
        >
          <PhoneDetailsPage phoneId={selectedPhone.id} />
        </Modal>
      )}
    </List>
  );
};

export default PhonesPage;