import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Conversation } from '../types/Conversation';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Separator} from "@radix-ui/react-select";
import { Badge } from "@/components/ui/badge"
import { getInitials } from '../lib/utils';
interface ConversationListProps {
  onSelect: (conversation: Conversation) => void;
  onTypeChange?: (type: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelect, onTypeChange }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, name: 'Conversation 1', unreadCount: 0 },
    { id: 2, name: 'Conversation 2', unreadCount: 1 },
    { id: 3, name: 'Conversation 3', unreadCount: 15 },
    { id: 4, name: 'Conversation 4', unreadCount: 1000 },
  ]);

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
    if (conversations.length > 0) {
      selectConversation(conversations[0]);
    }
  }, []);

  return (
    <>
      <div  className="p-3 border-b border-gray-200">
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
      <ScrollArea>
        {conversations.map((conv) => (
            <button
                key={conv.id}
                className={`flex items-center w-full p-3 hover:bg-accent ${
                    selectedConversation?.id === conv.id ? "bg-accent" : ""
                }`}
                onClick={() => selectConversation(conv)}
            >
              <Avatar className="size-8 mr-4">
                <AvatarFallback
                    className="bg-primary text-white">{getInitials(conv.name)}</AvatarFallback>
              </Avatar>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{conv.name}</p>
                {conv.unreadCount > 0 && (
                  <Badge variant="destructive">
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </Badge>
                )}
              </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || 'hello'}</p>
              </div>
            </button>
        ))}

      </ScrollArea>
    </>
  );
};

export default ConversationList;
