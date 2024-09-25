import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import TemplateList from './TemplateList';
import { Message } from '../types/Message';
import { Conversation } from '../types/Conversation';


interface ChatMessageProps {
  selectedConversation: Conversation | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ selectedConversation }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: 'Hello!', sender: 'user', senderName: 'You', timestamp: new Date() },
    { id: 2, content: 'Hi there! How can I help you?', sender: 'bot', senderName: 'AI Assistant', timestamp: new Date() },
  ]);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setMessages(prevMessages => [
      ...prevMessages,
      { ...prevMessages[0], id: prevMessages.length + 1 }
    ]);
  }, []);

  const isMessageEmpty = useMemo(() => newMessage.trim().length === 0, [newMessage]);

  const sendMessage = () => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        content: newMessage,
        sender: 'user',
        senderName: 'You',
        timestamp: new Date(),
      }
    ]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (selectedConversation !== null) {
      // Load messages for the selected conversation
      console.log(`Loading messages for conversation: ${selectedConversation}`);
    }
  }, [selectedConversation]);

  return (
    <div className="flex flex-col flex-1">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ height: 0 }}>
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
      </div>

      {/* Message Input */}
      <div className="p-4">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="mb-2"
        />
        <div className="flex justify-end space-x-2">
          <TemplateList />
          <Button onClick={sendMessage} disabled={isMessageEmpty}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;