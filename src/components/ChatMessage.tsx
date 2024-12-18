import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ChatMessageItem from "@/components/ChatMessageItem.tsx";
import {useAsyncFn} from "react-use";
import axios from "axios";
import {useAtomInstance, useAtomSelector, useAtomState, useAtomValue} from "@zedux/react";
import {getSelectedConversation, selectedConversationIdState} from "@/atoms/selectedConversation.ts";
import {messageState} from "@/atoms/messages.ts";
import InfiniteScroll from "@/components/common/InfiniteScroll.tsx";
import {conversationsState} from "@/atoms/conversations.ts";
import {AlarmClock} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

type getMessageListParams = {
  endTimestamp?: number
  startTimestamp?: number
  limit?: number
}


const ChatMessage: React.FC = ({id}: {id: string}) => {
  const selectedConversationId = useAtomValue(selectedConversationIdState);
  const {setRead} = useAtomInstance(conversationsState).exports
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
    console.log('Messages for: ', id, selectedConversation.name);
    updateId = true
    clearMessage()
    setHasMore(true);
    if(!id.startsWith('NEWCONV:')) {
      (async () => {
        await doFetch();
        selectedConversation.unreadCount && setRead(selectedConversationId)
      })()
    } // else new conversation
  }, [id]);
  useEffect(() => {
    // new message notify
    if(!updateId && selectedConversation.conversationId === id) {
      console.log('New Message', id);
      (async () => {
        await doFetch({
          limit: 100,
          startTimestamp: Math.min(...[Math.floor(Date.now()/1000) - 60].concat(messages.length ? messages[0].timestamp : [])) // 60s 内防止消息丢失
        }, true)
        selectedConversation.unreadCount && setRead(selectedConversationId)
      })()
    }
  }, [selectedConversation.modifiedAt, id]);

  const loadNext = useCallback(() => {
    doFetch(messages.length ? {endTimestamp: messages[messages.length - 1].timestamp} : {});
  }, [messages, doFetch]);

  const showWarnTemplate = selectedConversation.lastContactFromCustomers ? (Date.now() - new Date(selectedConversation.lastContactFromCustomers) >= 24*3600*1000) : selectedConversation.conversationId.startsWith('NEWCONV:')


  // console.log('M rerender', id, messages.length)
  return (
      <div ref={containerRef}
           className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4 pb-0 flex flex-col-reverse">
        {showWarnTemplate && <Alert variant={'warning'}>
          <AlarmClock className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Use Whatsapp template to send your first message after the 24-hour conversation window
          </AlertDescription>
        </Alert>}
        <div className="flex-1"></div>
        {messages.map((message) => <ChatMessageItem key={message.id} message={message}/>)}
        <InfiniteScroll error={state.error} loading={state.loading} loadNext={loadNext} hasMore={hasMore} initialized={messages.length > 0}/>
      </div>
)
  ;
};

export default React.memo(ChatMessage);
