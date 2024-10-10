import React, {useEffect, useMemo, useState, useRef, useCallback, useLayoutEffect} from 'react';
import ChatMessage from './ChatMessage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from '../types/Conversation.ts';
import {Message, NewMessage} from "@/types/Message.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import TemplateList from "@/components/TemplateList.tsx";
import {Button} from "@/components/ui/button.tsx";
import axios from 'axios';
import { useAsyncFn } from 'react-use';
import {CircleAlert, Loader2} from 'lucide-react'

interface ChatMessageProps {
  conversation: Conversation;
}

const ChatTabs: React.FC<ChatMessageProps> = ({conversation}) => {
  const containerRef = useRef<HTMLElement>();
  const snapShot = useRef(false);
  const isUpdate = useRef(false);

  if (containerRef.current && isUpdate.current) {
    // DOM Re-render 之前
    const listNode = containerRef.current!;
    snapShot.current = listNode.scrollTop > -60; // should restore position
  }
  useLayoutEffect(() => {
    isUpdate.current = true;
    if (snapShot.current) {
      containerRef.current!.scrollTop = 0;
    }
  });


  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const isMessageEmpty = useMemo(() => newMessage.trim().length === 0, [newMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);


  const [state, doFetch] = useAsyncFn(async (endTimeStamp: number | undefined = undefined) => {
    const limit = 10
    const {data} = await axios.get('/sleekflow/conversation/message/' + conversation.conversationId, {
      params: {
        limit,
        endTimeStamp,
      }
    });

    if (data.length < limit) {
      setHasMore(false);
    }
    if(data.length > 0) {
      setMessages((prev) => [...prev, ...data]);
    }
  }, [conversation, hasMore, messages]);

  useEffect(() => {
    setMessages([]);
    setHasMore(true);
    doFetch();
  }, [conversation]);


  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !state.loading && !state.error && messages.length) {
      doFetch(messages[messages.length - 1].timestamp - 1);
    }
  }, [doFetch, hasMore, state, messages]);

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
    setMessages(prevMessages => [
      {
        ...message,
        isSentFromSleekflow: true,
        updatedAt: new Date().toISOString(),
        status: 'Sending',
        timestamp: newMessageId / 1000,
        id: newMessageId,
      },
      ...prevMessages,
    ])
    setNewMessage('');
    const {data} = await axios.post('/sleekflow/message', message);
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
          <div ref={containerRef} className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4 pb-0 flex flex-col-reverse">
            <div className="flex-1"></div>
            <ChatMessage
                messages={messages}
            />
            <div ref={messagesEndRef} style={{height: "1px"}}></div>
            <div className={`flex justify-center items-center pb-4 empty:hidden ${messages.length === 0 ? 'flex-1' : ''}`}>
              {state.loading && <><Loader2 className="h-6 w-6 animate-spin"/> <span
                className={'text-xs ml-2'}>Loading...</span></>}
              {state.error && <><CircleAlert className="ml-1 size-4 text-destructive"/><span
                className={'text-xs ml-2 text-destructive'}>{state.error.message}</span></>}
            </div>
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
