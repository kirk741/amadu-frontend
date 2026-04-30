import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../../hooks/useUsers";
import List from "../../../components/ui/List/List";
import Modal from "../../../components/ui/Modal/Modal";
import EmptyCard from "../../../components/ui/EmptyCard/EmptyCard";

const PsychologistsPage = () => {
  const navigate = useNavigate();
  const { users, isLoading, searchQuery, setSearchQuery } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMenu = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <List
      items={users}
      isLoading={isLoading}
      isEmpty={users.length === 0}
      emptyComponent={<EmptyCard link={'/'} />}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      mapItem={(user) => ({
        id: user.id,
        type: 'user',
        title: user.name,
        description: user.bio,
        imageUrl: user.media?.[0]
          ? `${process.env.REACT_APP_API_URL}/storage/${user.media[0].file_path}`
          : null
      })}
      onItemBtnClick={openMenu}
      onItemClick={openMenu}
    >
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={[
            {
              name: 'Записаться на приём',
              onClick: () => navigate(`/appointment/${selectedUser.id}`)
            },
            {
              name: 'Открыть чат',
              onClick: () => navigate(`/chats/${selectedUser.id}`)
            },
            {
              name: 'Профиль психолога',
              onClick: () => navigate(`/user/${selectedUser.id}`)
            },
          ]}
        >
          {selectedUser?.name}
        </Modal>
      )}
    </List>
  );
}

export default PsychologistsPage;