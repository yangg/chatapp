import React, { useState, useEffect, useMemo } from 'react';
import { Message } from '../types/Message';
import {ScrollArea} from "@/components/ui/scroll-area.tsx";


interface ChatMessageProps {
  messages: Message[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messages }) => {

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className="mb-4">
          <div
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.sender === 'user'
                ? 'bg-green-200 ml-auto'
                : 'bg-gray-200 text-black'
            }`}
          >
            <p className="mb-1">{msg.content}</p>
            <div className="flex justify-between items-center text-xs opacity-75">
              <span>{formatTime(msg.timestamp)}</span>
              <span>{msg.senderName}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatMessage;
