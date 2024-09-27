import React from 'react';
import { Message } from '../types/Message';


const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface ChatMessageProps {
  messages: Message[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messages }) => {

  return (
    <>
      {messages.map((message) => (
        <div
        key={message.id}
        className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[70%] min-w-[150px] p-3 rounded-lg ${
            message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
      ))}
    </>
  );
};

export default ChatMessage;
