import React, {useMemo, useState} from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from '../types/Conversation.ts';
import {NewMessage, TextMessage} from "@/types/Message.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import TemplateList from "@/components/TemplateList.tsx";
import {Button} from "@/components/ui/button.tsx";
import axios from 'axios';
import ChatMessage from "@/components/ChatMessage.tsx";
import {useAtomInstance} from "@zedux/react";
import {messageState} from "@/atoms/messages.ts";

interface ChatMessageProps {
  conversation: Conversation;
}

const ChatTabs: React.FC<ChatMessageProps> = ({conversation}) => {
  const messagesInst = useAtomInstance(messageState).exports

  const tabs = useMemo(() => {
    return [conversation.lastMessageChannel === 'web' ? 'WebChat' : 'WhatsApp']
  }, [conversation])
  const [newMessage, setNewMessage] = useState('');
  const isSendable = useMemo(() => newMessage.trim().length === 0, [newMessage]);

  const sendMessage = () => {
    const params: TextMessage = {
      messageType: 'text',
      messageContent: newMessage,
    }
    setNewMessage('')
    messagesInst.sendMessage(params, conversation)
  }

  return (
    <>
      <Tabs defaultValue={tabs[0]} key={conversation.conversationId} className='flex-1 flex flex-col' >
        <div className="flex justify-center mt-4">
          <TabsList className="justify-center">
            {tabs.map(tab => (<TabsTrigger value={tab} key={tab}>{tab}</TabsTrigger>))}
          </TabsList>
        </div>
        {tabs.map(tab => (<TabsContent value={tab} key={tab} className="flex-1 relative">
          <ChatMessage/>
        </TabsContent>))}

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
          <Button onClick={sendMessage} disabled={isSendable}>
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatTabs;
