import { useState, useEffect, useRef } from 'react';
import client from '../api/client';

export const useChat = (receiverId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);

  const [myId, setMyId] = useState(null);

  const pollingIntervalRef = useRef(null);
  const receiverIdRef = useRef(receiverId);

  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  const loadChat = async (showLoading = true) => {
    if (!receiverIdRef.current || receiverIdRef.current === 'undefined') {
      setIsLoading(false);
      return;
    }

    if (showLoading) setIsLoading(true);
    try {
      const res = await client(`/chats/${receiverIdRef.current}`);
      const currentConversationId = res.conversation_id || res.id;
      setConversationId(currentConversationId);

      if (res.conversation) {
        const isReceiverClient = String(res.conversation.client_id) === String(receiverIdRef.current);
        setMyId(isReceiverClient ? res.conversation.psychologist_id : res.conversation.client_id);
      } else if (res.client_id || res.psychologist_id) {
        const isReceiverClient = String(res.client_id) === String(receiverIdRef.current);
        setMyId(isReceiverClient ? res.psychologist_id : res.client_id);
      }

      const fetchedMessages = res.messages || res.data || [];
      setMessages(fetchedMessages);

      if (currentConversationId && fetchedMessages.some(m => !m.read_at && m.sender_id !== 'me')) {
        client('/messages/read-all', { body: { conversation_id: currentConversationId } }).catch(() => { });
      }
    } catch (e) {
      console.error("Ошибка чата:", e);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    setMessages([]);
    setConversationId(null);
    setMyId(null);

    if (receiverId && receiverId !== 'undefined') {
      loadChat(true);
    }
  }, [receiverId]);

  useEffect(() => {
    if (!receiverId || receiverId === 'undefined') return;

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      loadChat(false);
    }, 2500);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [receiverId]);

  const sendMessage = async (text) => {
    if (!text.trim() || !conversationId) return;
    try {
      await client('/messages', { body: { conversation_id: conversationId, body: text } });
      loadChat(false);
    } catch (e) {
      console.error(e);
    }
  };

  const editMessage = async (messageId, newText) => {
    if (!newText.trim()) return;
    try {
      await client(`/messages/${messageId}`, {
        body: { _method: 'PATCH', body: newText }
      });
      loadChat(false);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await client(`/messages/${messageId}`, {
        body: { _method: 'DELETE' }
      });
      loadChat(false);
    } catch (e) {
      console.error(e);
    }
  };

  return { messages, isLoading, myId, sendMessage, editMessage, deleteMessage };
};
