import React, {useEffect, useMemo, useState, useRef, useCallback} from 'react';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isMessageEmpty = useMemo(() => newMessage.trim().length === 0, [newMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const [state, doFetch] = useAsyncFn(async (pageNum: number) => {
    const limit = 6
    const {data} = await axios.get('/sleekflow/conversation/message/' + conversation.conversationId, {
      params: {
        limit,
        offset: limit * (pageNum - 1),
      }
    });
    
    if (data.length < limit) {
      setHasMore(false);
    } else {
      setMessages((prev) => [...prev, ...data]);
      setPage((prevPage) => prevPage + 1);
    }
  }, [conversation, hasMore]);

  useEffect(() => {
    if(conversation) {
      setMessages([]);
      setHasMore(true);
      setPage(1);
      doFetch(1);
    }
  }, [conversation]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !state.loading) {
      doFetch(page);
    }
  }, [doFetch, hasMore, page, state]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (messagesEndRef.current) observerRef.current.observe(messagesEndRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    }
  }, [handleObserver]);

  const sendMessage = async () => {
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
        isSentFromSleekflow: true, // for web
        channelIdentityId: message.from, // for whatsappcloudapi
        updatedAt: new Date().toISOString(),
        status: 'Sending',
        id: newMessageId,
      },
      ...prevMessages,
    ])
    setNewMessage('');
    const {data} = await axios.post('/sleekflow/message', message);
    console.log(data)
    setMessages(prevMessages => prevMessages.map(x => x.id === newMessageId ? {...message, ...data} : x))
    return
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
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4 flex flex-col-reverse">
            <ChatMessage
                messages={messages}
            />
            <div ref={messagesEndRef} style={{ height: "1px" }}></div>
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
      </div>
    </>
  );
};

export default ChatTabs;
