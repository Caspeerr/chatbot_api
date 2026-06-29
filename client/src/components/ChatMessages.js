import React from 'react';

function ChatMessages({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div key={index} className={`chat-message ${message.role}`}>
          <div className="chat-bubble">
            <span>{message.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;
