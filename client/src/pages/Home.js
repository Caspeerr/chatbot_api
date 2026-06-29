// src/pages/Home.js
import React from 'react';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import useChat from '../hooks/useChat';

function Home() {
  const { messages, loading, error, sendMessage } = useChat();

  return (
    <div className="home">
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">
            <span className="title-accent">CHAT</span>
          </h1>
          <div className="header-stats">
            <span className="stat">Talk to a friendly assistant</span>
          </div>
        </div>
        <p className="app-subtitle">Type a message and I will reply.</p>

        <div className={`connection-badge ${error ? 'disconnected' : 'connected'}`}>
          <span className="dot" />
          {error ? 'API offline' : 'Connected to Chat API'}
        </div>
      </header>

      <ChatMessages messages={messages} />
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}

export default Home;