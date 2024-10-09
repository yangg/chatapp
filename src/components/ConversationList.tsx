import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Conversation } from '../types/Conversation';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge"
import { getInitials } from '../lib/utils';
import {useAsync, useAsyncFn} from 'react-use';
import axios from 'axios';

interface ConversationListProps {
  onSelect: (conversation: Conversation) => void;
  onTypeChange?: (type: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelect, onTypeChange }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [state, doFetch] = useAsyncFn(async () => {
    const {data} = await axios.get('/sleekflow/conversation', {
      params: {
        orderBy: 'desc',
        limit: 30,
      }
    });
    setConversations((prev) => [...prev, ...data]);
    return
  }, []);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedType, setSelectedType] = useState<string>('general');

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    onSelect(conv);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onTypeChange && onTypeChange(type);
  };

  useEffect(() => {
    console.log('fetching conversations3');
    setConversations([]);
    doFetch();
  }, []);
  useEffect(() => {
    if(!selectedConversation && conversations.length > 0) {
      selectConversation(conversations[0]);
    }
  }, [conversations])

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="file">File Message</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 relative">
        <div className='overflow-y-auto absolute top-0 left-0 right-0 bottom-0' >
        {state.loading
        ? <div>Loading...</div>
        : state.error
          ? <div>Error: {state.error.message}</div>
          : conversations.map((conv) => (
            <button
                key={conv.conversationId}
                className={`flex items-center w-full p-3 hover:bg-accent ${
                    selectedConversation?.conversationId === conv.conversationId ? "bg-accent" : ""
                }`}
                onClick={() => selectConversation(conv)}
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
        ))
      }

        </div>
      </div>
    </div>
  );
};

export default ConversationList;
