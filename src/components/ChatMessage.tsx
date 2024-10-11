import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ChatMessageItem from "@/components/ChatMessageItem.tsx";
import {useAsyncFn} from "react-use";
import axios from "axios";
import {CircleAlert, Loader2} from "lucide-react";
import {useAtomSelector, useAtomState} from "@zedux/react";
import {getSelectedConversation} from "@/atoms/selectedConversation.ts";
import {messageState} from "@/atoms/messages.ts";


const ChatMessage: React.FC = () => {
  const selectedConversation = useAtomSelector(getSelectedConversation)!;

  const containerRef = useRef<HTMLDivElement>(null);
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


  const [messages, {appendMessage, clearMessage}] = useAtomState(messageState);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);


  const [state, doFetch] = useAsyncFn(async (endTimeStamp: number | undefined = undefined) => {
    const limit = 10
    const {data} = await axios.get('/sleekflow/conversation/message/' + selectedConversation.conversationId, {
      params: {
        limit,
        endTimeStamp,
      }
    });

    if (data.length < limit) {
      setHasMore(false);
    }
    if(data.length > 0) {
      appendMessage(data);
    }
  }, [selectedConversation, hasMore, messages]);

  useEffect(() => {
    clearMessage()
    setHasMore(true);
    doFetch();
  }, [selectedConversation]);


  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !state.loading && !state.error && messages.length) {
      // 如果减去 1 秒有丢消息情况，可以不减，然后合并时去除重复的。
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

  return (
      <div ref={containerRef}
           className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4 pb-0 flex flex-col-reverse">
        <div className="flex-1"></div>
        {messages.map((message) => <ChatMessageItem key={message.id} message={message}/>)}
        <div ref={messagesEndRef} style={{height: "1px"}}></div>
        <div className={`flex justify-center items-center pb-4 empty:hidden ${messages.length === 0 ? 'flex-1' : ''}`}>
          {state.loading && <><Loader2 className="h-6 w-6 animate-spin"/> <span
            className={'text-xs ml-2'}>Loading...</span></>}
          {state.error && <><CircleAlert className="ml-1 size-4 text-destructive"/><span
            className={'text-xs ml-2 text-destructive'}>{state.error.message}</span></>}
        </div>
      </div>
)
  ;
};

export default ChatMessage;
