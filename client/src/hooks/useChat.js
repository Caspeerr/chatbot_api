import { useState, useCallback } from 'react';
import { chatApi } from '../services/api';

function useChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your chatbot. Type a message and I will reply.' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setLoading(true);

    try {
      const response = await chatApi.send(trimmed);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}

export default useChat;
