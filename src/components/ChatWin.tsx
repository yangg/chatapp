import React, { useState, useMemo } from 'react';
import ConversationList from './ConversationList.tsx';
import PersonInfo from './PersonInfo.tsx';
import ChatTabs from './ChatTabs.tsx';

// ... existing code ...

function ChatWin() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleConversationSelect = (id) => {
    setSelectedConversation(id);
    // Here you would typically load the messages for the selected conversation
    console.log(`Selected conversation: ${id}`);
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
    <div className="flex h-screen">
      <ConversationList
        onSelect={handleConversationSelect}
      />

      <ChatTabs
        selectedConversation={selectedConversation}
      />

      <PersonInfo
        personInfo={selectedPersonInfo}
      />
    </div>
  );
}

export default ChatWin;