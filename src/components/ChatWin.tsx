import { useState, useMemo } from 'react';
import ConversationList from './ConversationList.tsx';
import PersonInfo from './PersonInfo.tsx';
import ChatTabs from './ChatTabs.tsx';
import {Conversation} from "@/types/Conversation.ts";

// ... existing code ...

function ChatWin() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleConversationSelect = (conv: Conversation) => {
    setSelectedConversation(conv);
    // Here you would typically load the messages for the selected conversation
    console.log(`Selected conversation: `, conv);
  };

  const [personInfo] = useState({
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'user@example.com',
  });

  const selectedPersonInfo = useMemo(() => {
    if (selectedConversation) {
      return personInfo;
    }
    return null;
  }, [selectedConversation, personInfo]);

  return (
    <div className="flex h-full w-full bg-white">
      <ConversationList
        onSelect={handleConversationSelect}
      />

      <ChatTabs
        conversation={selectedConversation}
      />

      <PersonInfo
        personInfo={selectedPersonInfo}
      />
    </div>
  );
}

export default ChatWin;
