import React, {useState, useEffect, useCallback} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Conversation} from '../types/Conversation';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge"
import {getInitials} from '../lib/utils';
import {useAsyncFn} from 'react-use';
import axios from 'axios';
import {useAtomSelector, useAtomState} from "@zedux/react";
import {conversationsState} from "@/atoms/conversations.ts";
import {selectedConversationIdState} from "@/atoms/selectedConversation.ts";
import InfiniteScroll from "@/components/InfiniteScroll.tsx";
import {
  conversationTypesState,
  getSelectedConversationType,
  selectedConversationTypeIdState
} from "@/atoms/conversationTypes.ts";


const ConversationList: React.FC = () => {
  const [conversationTypes] = useAtomState(conversationTypesState)
  const [conversations, {appendConversation, clearConversation}] = useAtomState(conversationsState);
  const [selectedConversationId, setSelectedConversationId] = useAtomState(selectedConversationIdState);
  const [selectedConversationTypeId, setSelectedConversationTypeId] = useAtomState(selectedConversationTypeIdState)
  const selectedConversationType = useAtomSelector(getSelectedConversationType)
  const [hasMore, setHasMore] = useState(true);
  const [state, loadConversation] = useAsyncFn(async (modifiedAt = '') => {
    const limit = 10
    const {data} = await axios.get('/sleekflow/conversation', {
      params: {
        limit,
        modifiedAt,
        getData: selectedConversationType.getData
      },
    })
    appendConversation(data)
    if(data.length < limit) {
      setHasMore(false);
    }
    return
  }, [selectedConversationType]);


  function onTypeChange(value) {
    setSelectedConversationTypeId(value)
    setSelectedConversationId([''])
  }
  function selectConversation(conv: Conversation) {
    setSelectedConversationId([conv.conversationId]);
  }

  useEffect(() => {
    console.log('fetching conversations', selectedConversationTypeId);
    setHasMore(true)
    clearConversation();
    setSelectedConversationId([''])
    loadConversation('')
  }, [selectedConversationTypeId]);
  useEffect(() => {
    if (!selectedConversationId[0] && conversations.length > 0) {
      selectConversation(conversations[0]);
    }
  }, [conversations])

  const loadNext = useCallback(() => {
    // 如果减去 1 秒有丢消息情况，可以不减，然后合并时去除重复的。
    loadConversation(conversations.length ? conversations[conversations.length - 1].modifiedAt: '');
  }, [conversations]);

  return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-gray-200">
          <Select value={selectedConversationTypeId} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              {conversationTypes.map(type => <SelectItem key={type.title} value={type.title}>{type.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 relative">
          <div className='overflow-y-auto absolute top-0 left-0 right-0 bottom-0 flex flex-col'>
            {conversations.map((conv) =>
                <ConversationListItem key={conv.conversationId} conv={conv} selectedConversationId={selectedConversationId} onSelectConversation={selectConversation} />)
            }
            <InfiniteScroll error={state.error} loading={state.loading} loadNext={loadNext} hasMore={hasMore} initialized={conversations.length > 0}/>
          </div>
        </div>
      </div>
  );
};

interface ConversationListItemProps {
  conv: Conversation;
  selectedConversationId: [string, number?];
  onSelectConversation: (conv: Conversation) => void;
}

function ConversationListItem({ conv, selectedConversationId, onSelectConversation } : ConversationListItemProps) {
  return (
      (
          <button
              key={conv.conversationId}
              className={`flex items-center w-full p-3 hover:bg-accent ${
                  selectedConversationId[0] === conv.conversationId ? "bg-accent" : ""
              }`}
              onClick={() => onSelectConversation(conv)}
          >
            <Avatar className="size-8 mr-4">
              <AvatarFallback
                  className="bg-primary text-white">{getInitials(conv.title)}</AvatarFallback>
            </Avatar>
            <div className="text-left flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{conv.title}</p>
                {conv.unreadMessageCount > 0 && (
                    <Badge variant="destructive">
                      {conv.unreadMessageCount > 99 ? '99+' : conv.unreadMessageCount}
                    </Badge>
                )}
              </div>
              {/*<p className="text-xs text-muted-foreground truncate">{conv.lastMessage || 'hello'}</p>*/}
              {conv.contacts && <div className="flex flex-wrap gap-1">
                {conv.contacts.map((item, index) => (
                    <Badge variant={'outline'} key={index} className="rounded-full">
                  {item.displayName}
                </Badge>
                ))}
              </div>}
            </div>
          </button>
      )
  )
}

export default ConversationList;
