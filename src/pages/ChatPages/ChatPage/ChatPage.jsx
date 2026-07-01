import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../../hooks/useChat';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import Modal from '../../../components/ui/Modal/Modal';
import * as Icons from '../../../assets/icons';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage, editMessage, deleteMessage } = useChat(id);
  
  const [text, setText] = useState('');
  const [modal, setModal] = useState({ open: false, type: '' });
  const [activeMessage, setActiveMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const prevMessagesCountRef = useRef(0);

  useEffect(() => {
    if (messages.length > prevMessagesCountRef.current) {
      scrollToBottom();
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  const handleOpenOptions = (msg) => {
    const isMessageFromMe = String(msg.sender_id) !== String(id) && msg.sender_id !== 'me';
    
    if (isMessageFromMe && msg.content_type !== 'deleted') {
      setActiveMessage(msg);
      setModal({ open: true, type: 'options' });
    }
  };

  const handleOpenEditForm = () => {
    setEditText(activeMessage.body);
    setModal({ open: true, type: 'edit' });
  };

  const handleConfirmEdit = async () => {
    if (!editText.trim()) return;
    await editMessage(activeMessage.id, editText);
    setModal({ open: false, type: '' });
    setActiveMessage(null);
  };

  const handleConfirmDelete = async () => {
    await deleteMessage(activeMessage.id);
    setModal({ open: false, type: '' });
    setActiveMessage(null);
  };

  const modalButtons = [];
  if (modal.type === 'options') {
    modalButtons.push(
      { name: 'Изменить', preventClose: true, onClick: handleOpenEditForm },
      { name: 'Удалить для всех', onClick: handleConfirmDelete }
    );
  } else if (modal.type === 'edit') {
    modalButtons.push(
      { name: 'Сохранить', preventClose: true, onClick: handleConfirmEdit },
      { name: 'Отмена', onClick: () => setModal({ open: false, type: '' }) }
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesWindow}>
        {isLoading ? (
          <>
            <div className={`${styles.skeletonBubble} ${styles.skeletonTheir}`} />
            <div className={`${styles.skeletonBubble} ${styles.skeletonMy}`} />
            <div className={`${styles.skeletonBubble} ${styles.skeletonTheir} ${styles.skeletonShort}`} />
            <div className={`${styles.skeletonBubble} ${styles.skeletonMy}`} />
            <div className={`${styles.skeletonBubble} ${styles.skeletonTheir}`} />
          </>
        ) : (
          messages.map((msg) => {
            const isMe = String(msg.sender_id) !== String(id) || msg.sender_id === 'me';
            const isDeleted = msg.content_type === 'deleted';

            return (
              <div
                key={msg.id}
                className={`${styles.messageBubble} ${isMe ? styles.myMessage : styles.theirMessage} ${isDeleted ? styles.deletedMessage : ''}`}
                onClick={() => handleOpenOptions(msg)}
              >
                <p className={styles.messageText}>{msg.body}</p>
                <div className={styles.metaRow}>
                  <span className={styles.messageTime}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && !isDeleted && (
                    <span className={msg.read_at ? styles.readStatus : styles.unreadStatus}>
                      {msg.read_at ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputPanel} onSubmit={handleSend}>
        <div className={styles.inputWrapper}>
          <Input
            type="text"
            placeholder="Сообщение..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSend(e);
              }
            }}
          />
        </div>
        <Button type="submit" className={styles.sendBtn}>
          <Icons.ArrowForward className={styles.sendIcon} />
        </Button>
      </form>

      {modal.open && (
        <Modal
          onClose={() => setModal({ open: false, type: '' })}
          title={modal.type === 'options' ? 'Управление сообщением' : 'Редактирование'}
          childrenData={modalButtons}
        >
          {modal.type === 'options' && (
            <span>Выберите действие для сообщения: <br /><strong>"{activeMessage?.body}"</strong></span>
          )}
          {modal.type === 'edit' && (
            <div className={styles.modalInputWrapper}>
              <Input
                type="text"
                placeholder="Новый текст сообщения"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ChatPage;
