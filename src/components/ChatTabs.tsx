import React, {useEffect, useMemo, useState} from 'react';
import ChatMessage from './ChatMessage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from '../types/Conversation.ts';
import {Message} from "@/types/Message.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import TemplateList from "@/components/TemplateList.tsx";
import {Button} from "@/components/ui/button.tsx";

interface ChatMessageProps {
  conversation: Conversation | null;
}

const ChatTabs: React.FC<ChatMessageProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: 'Hello!', sender: 'user', senderName: 'You', timestamp: new Date() },
    { id: 2, content: 'Hi there! How can I help you?', sender: 'bot', senderName: 'AI Assistant', timestamp: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState('');
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

  useEffect(() => {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        for (let i = 1; i <= 10; i++) {
          console.log('i', i);
          newMessages.push({
            ...prevMessages[0],
            id: newMessages.length + 1,
          });
        }
        return newMessages;
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/*  I don't know why it needs to be 500px, but it does work */}
      <Tabs defaultValue="account" className='flex-1 flex flex-col' style={{height: '500px'}}>
        <div className="flex justify-center mt-4">
          <TabsList className="justify-center">
            <TabsTrigger value="account">
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="password">
              WhatsApp (Brook)
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="account" className="flex-1 overflow-y-auto p-4">
          <ChatMessage
              messages={messages}
          />
        </TabsContent>
        <TabsContent value="password" className="flex-1 overflow-y-auto p-4">
          <ChatMessage
              messages={messages}
          />
        </TabsContent>
      </Tabs>
       {/* Message Input */}
       <div className='p-4'>
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

export default ChatTabs;
