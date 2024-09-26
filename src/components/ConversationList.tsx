import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Conversation } from '../types/Conversation';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Separator} from "@radix-ui/react-select";

interface ConversationListProps {
  onSelect: (conversation: Conversation) => void;
  onTypeChange?: (type: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelect, onTypeChange }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, name: 'Conversation 1' },
    { id: 2, name: 'Conversation 2' },
    { id: 3, name: 'Conversation 3' },
    { id: 4, name: 'Conversation 4' },
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
    <div className="w-1/5 border-r border-gray-200">
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
              <Avatar className="size-8 mr-2">
                <AvatarFallback
                    className="bg-primary text-white">{conv.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium">{conv.name}</p>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || 'hello'}</p>
              </div>
            </button>
        ))}

      </ScrollArea>
    </div>
  );
};

export default ConversationList;
