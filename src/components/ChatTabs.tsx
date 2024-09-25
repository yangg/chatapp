import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from '../types/Conversation';


const ChatTabs: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <Tabs defaultValue="account" className="w-3/5 flex flex-col">
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
      <TabsContent value="account" className="flex-1 flex flex-col">
        <ChatMessage
          selectedConversation={selectedConversation}
        />
      </TabsContent>
      <TabsContent value="password" className="">
        <ChatMessage
          selectedConversation={selectedConversation}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ChatTabs;