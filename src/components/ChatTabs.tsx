import React, {useEffect, useMemo, useState} from 'react';
import ChatMessage from './ChatMessage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from '../types/Conversation.ts';
import {Message} from "@/types/Message.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import TemplateList from "@/components/TemplateList.tsx";
import {Button} from "@/components/ui/button.tsx";
import axios from 'axios';
import { useAsyncFn } from 'react-use';

interface ChatMessageProps {
  conversation: Conversation | null;
}

const ChatTabs: React.FC<ChatMessageProps> = ({conversation}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const isMessageEmpty = useMemo(() => newMessage.trim().length === 0, [newMessage]);
  


  const [state, doFetch] = useAsyncFn(async () => {
    const {data} = await axios.get('/sleekflow/conversation/message/' + conversation?.conversationId);
    setMessages((prev) => [...prev, ...data]);
    return
  }, [conversation]);

  useEffect(() => {
    if(conversation) {
      setMessages([]);
      doFetch();
    }
  }, [conversation]);

  const [sendState, sendMessage] = useAsyncFn(async () => {
    const channel = conversation.lastMessageChannel
    const message = {
      channel,
      "messageType": "text",
      "messageContent": newMessage,
    }
    if(channel === 'web') {
      message.webClientSenderId = conversation.userProfile.webClient.webClientUUID
    } else {
      message.from = conversation.lastChannelIdentityId
      message.to = conversation.userProfile.whatsappCloudApiUser.userIdentityId
    }
    const newMessageId = new Date().valueOf()
    setMessages(prevMessages => [
      {
        ...message,
        deliveryType: 'AutomatedMessage',
        channelIdentityId: message.from,
        updatedAt: new Date().toISOString(),
        status: 'Sending',
        id: newMessageId,
      },
      ...prevMessages,
    ])
    const {data} = await axios.post('/sleekflow/message', message);
    console.log(data)
    setMessages(prevMessages => prevMessages.map(x => x.id === newMessageId ? {...message, ...data} : x))
    setNewMessage('');
    return
  }, [conversation, newMessage]);

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
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4 flex flex-col-reverse">
            <ChatMessage
                messages={messages} 
                conversation={conversation}
            />
          </div>
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
        <p>{sendState.error?.message}</p>
      </div>
    </>
  );
};

export default ChatTabs;
