import React, {useMemo, useState} from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from '../types/Conversation.ts';
import {NewMessage} from "@/types/Message.ts";
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
  const messagesInst = useAtomInstance(messageState)

  const [newMessage, setNewMessage] = useState('');
  const isSendable = useMemo(() => newMessage.trim().length === 0, [newMessage]);

  const sendMessage = async () => {
    const channel = conversation.lastMessageChannel
    const message: NewMessage = {
      "messageType": "text",
      "messageContent": newMessage,
      ...(channel === 'web' ? {
        channel,
        webClientSenderId: conversation.userProfile.webClient.webClientUUID,
      }: {
        channel,
        from: conversation.lastChannelIdentityId,
        channelIdentityId: conversation.lastChannelIdentityId,
        to: conversation.userProfile.whatsappCloudApiUser.userIdentityId,
      })
    }
    const newMessageId = Date.now()
    messagesInst.exports.prependMessage([
      {
        ...message,
        isSentFromSleekflow: true,
        updatedAt: new Date().toISOString(),
        status: 'Sending',
        timestamp: newMessageId / 1000,
        id: newMessageId,
      },
    ])
    setNewMessage('');
    const {data} = await axios.post('/sleekflow/message', message);
    messagesInst.exports.setState(prevMessages => prevMessages.map(x => x.id === newMessageId ? {...message, ...data} : x))
  };

  return (
    <>
      <Tabs defaultValue="whatsappcloudapi" className='flex-1 flex flex-col' >
        <div className="flex justify-center mt-4">
          <TabsList className="justify-center">
            <TabsTrigger value="whatsappcloudapi">
              WhatsApp
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="whatsappcloudapi" className="flex-1 relative">
          <ChatMessage/>
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
          <Button onClick={sendMessage} disabled={isSendable}>
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatTabs;
