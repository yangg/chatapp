import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Conversation } from '../types/Conversation';

interface ConversationListProps {
  onSelect: (conversation: Conversation) => void;
  onTypeChange?: (type: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelect, onTypeChange }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, name: 'Conversation 1' },
    { id: 2, name: 'Conversation 2' },
    { id: 3, name: 'Conversation 3' },
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
    <div className="w-1/5 p-4 overflow-y-auto border-r border-gray-200">
      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="file">File Message</SelectItem>
        </SelectContent>
      </Select>
      <ul>
        {conversations.map((conv, index) => (
          <li key={conv.id} className="mb-2">
            <div
              onClick={() => selectConversation(conv)}
              className={`flex items-center p-2 cursor-pointer rounded ${
                selectedConversation?.id === conv.id ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full mr-2 bg-primary flex items-center justify-center text-white font-bold">
                {conv.name.charAt(0).toUpperCase()}
              </div>
              <span>{conv.name}</span>
            </div>
            {index !== conversations.length - 1 && <hr className="my-2 border-gray-200" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;