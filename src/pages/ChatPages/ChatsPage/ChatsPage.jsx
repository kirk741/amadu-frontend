import { useNavigate } from 'react-router-dom';
import List from '../../../components/ui/List/List';
import { useConversations } from '../../../hooks/useConversations';
import * as Icons from '../../../assets/icons';

const ChatsPage = () => {
  const navigate = useNavigate();
  const { conversations, isLoading } = useConversations();

  const mapConversationToCard = (item) => {
    const partner = item.partner;
    const partnerId = item.partner_id;

    const mediaArray = partner?.media || item.partner?.media;
    const mediaItem = mediaArray && mediaArray.length > 0 ? mediaArray[0] : null;

    const avatarPath = mediaItem ? mediaItem.file_path : null;
    const avatarUrl = avatarPath
      ? `${process.env.REACT_APP_API_URL}/storage/${avatarPath}`
      : null;

    const lastMsg = item.last_message ? item.last_message.body : 'Нет сообщений';

    return {
      id: item.id,
      type: 'user',
      imageUrl: avatarUrl,
      buttonIcons: [Icons.Chats],
      title: partner?.name || 'Диалог',
      description: lastMsg,
      partnerId: partnerId || partner?.id
    };
  };

  return (
    <List
      items={conversations}
      isLoading={isLoading}
      mapItem={mapConversationToCard}

      onItemClick={(item) => {
        const id = item?.partnerId || item?.partner_id || item?.id;
        if (id && id !== 'undefined') {
          navigate(`/chat/${id}`);
        }
      }}

      onItemBtnClick={(item) => {
        const id = item?.partnerId || item?.partner_id || item?.id;
        if (id && id !== 'undefined') {
          navigate(`/chat/${id}`);
        }
      }}
      isEmpty={conversations.length === 0}
      emptyComponent={<div>У вас пока нет активных диалогов.</div>}
    />
  );
};

export default ChatsPage;
