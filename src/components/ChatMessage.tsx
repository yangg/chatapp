import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ChatMessageItem from "@/components/ChatMessageItem.tsx";
import {useAsyncFn} from "react-use";
import axios from "axios";
import {useAtomSelector, useAtomState} from "@zedux/react";
import {getSelectedConversation} from "@/atoms/selectedConversation.ts";
import {messageState} from "@/atoms/messages.ts";
import InfiniteScroll from "@/components/InfiniteScroll.tsx";

type getMessageListParams = {
  endTimeStamp?: number
  startTimeStamp?: number
  limit?: number
}


const ChatMessage: React.FC = ({id}: {id: string}) => {
  const selectedConversation = useAtomSelector(getSelectedConversation)!;
  let updateId = false

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

  const [messages, {appendMessage, prependMessage, clearMessage}] = useAtomState(messageState, [id]);
  const [hasMore, setHasMore] = useState(true);
  const [state, doFetch] = useAsyncFn(async (params: getMessageListParams = {}, prepend = false) => {
    params.limit = params.limit || 10
    const {data} = await axios.get('/sleekflow/conversation/message/' + id, {
      params
    });

    if(!prepend) {
      if (data.length < params.limit) {
        setHasMore(false);
      }
      if(data.length > 0) {
        appendMessage(data);
      }
    } else {
      prependMessage(data);
    }
  }, [id, hasMore, messages]);

  useEffect(() => {
    console.log('Messages for: ', id, selectedConversation.title);
    updateId = true
    clearMessage()
    setHasMore(true);
    if(id !== '0') {
      doFetch();
    } // else new conversation
  }, [id]);
  useEffect(() => {
    // new message notify
    if(!updateId && selectedConversation.conversationId === id) {
      console.log('New Message', id)
      doFetch({
        limit: 100,
        startTimeStamp: Math.min(messages[0]?.timestamp, Math.floor(Date.now()/1000) - 60) // 60s 内防止消息丢失
      }, true)
    }
  }, [selectedConversation, id]);

  const loadNext = useCallback(() => {
    // 如果减去 1 秒有丢消息情况，可以不减，然后合并时去除重复的。
    doFetch(messages.length ? {endTimeStamp: messages[messages.length - 1].timestamp - 1} : {});
  }, [messages, doFetch]);


  console.log('M rerender', id, messages.length)
  return (
      <div ref={containerRef}
           className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4 pb-0 flex flex-col-reverse">
        <div className="flex-1"></div>
        {messages.map((message) => <ChatMessageItem key={message.id} message={message}/>)}
        <InfiniteScroll error={state.error} loading={state.loading} loadNext={loadNext} hasMore={hasMore} initialized={messages.length > 0}/>
      </div>
)
  ;
};

export default React.memo(ChatMessage);
