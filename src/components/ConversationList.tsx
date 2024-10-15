import React, {useState, useEffect, useCallback} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Conversation} from '../types/Conversation';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge"
import {getInitials} from '../lib/utils';
import {useAsyncFn} from 'react-use';
import axios from 'axios';
import {useAtomState} from "@zedux/react";
import {conversationState} from "@/atoms/conversations.ts";
import {selectedConversationIdState} from "@/atoms/selectedConversation.ts";
import InfiniteScroll from "@/components/InfiniteScroll.tsx";


const ConversationList: React.FC = () => {
  const [conversations, {appendConversation, clearConversation}] = useAtomState(conversationState);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [state, loadNext] = useAsyncFn(async () => {
    const limit = 10
    const {data} = await axios.get('/sleekflow/conversation', {
      params: {
        limit,
        offset: currentPage * limit
      },
    })
    appendConversation(data)
    if(data.length < limit) {
      setHasMore(false);
    } else {
      setCurrentPage(currentPage + 1);
    }
    return
  }, [currentPage]);

  const [selectedConversationId, setSelectedConversationId] = useAtomState(selectedConversationIdState);
  const [selectedType, setSelectedType] = useState<string>('general');


  useEffect(() => {
    console.log('fetching conversations3');
    clearConversation();
    setCurrentPage(0)
    loadNext();
  }, []);
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].conversationId);
    }
  }, [conversations])

  return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-gray-200">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="file">File Message</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 relative">
          <div className='overflow-y-auto absolute top-0 left-0 right-0 bottom-0 flex flex-col'>
            {conversations.map((conv) => <ConversationListItem key={conv.conversationId} conv={conv} selectedConversationId={selectedConversationId} setSelectedConversationId={setSelectedConversationId} />)
            }
            <InfiniteScroll error={state.error} loading={state.loading} loadNext={loadNext} hasMore={hasMore} initialized={conversations.length > 0}/>
          </div>
        </div>
      </div>
  );
};

interface ConversationListItemProps {
  conv: Conversation;
  selectedConversationId: string;
  setSelectedConversationId: (id: string) => void;
}

function ConversationListItem({ conv, selectedConversationId, setSelectedConversationId } : ConversationListItemProps) {
  return (
      (
          <button
              key={conv.conversationId}
              className={`flex items-center w-full p-3 hover:bg-accent ${
                  selectedConversationId === conv.conversationId ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedConversationId(conv.conversationId)}
          >
            <Avatar className="size-8 mr-4">
              <AvatarFallback
                  className="bg-primary text-white">{getInitials(conv.userProfile.firstName)}</AvatarFallback>
            </Avatar>
            <div className="text-left flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{conv.userProfile.firstName}</p>
                {conv.unreadMessageCount > 0 && (
                    <Badge variant="destructive">
                      {conv.unreadMessageCount > 99 ? '99+' : conv.unreadMessageCount}
                    </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || 'hello'}</p>
            </div>
          </button>
      )
  )
}

export default ConversationList;
