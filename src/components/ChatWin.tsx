import {useState, useMemo} from 'react';
import ConversationList from './ConversationList.tsx';
import PersonInfo from './PersonInfo.tsx';
import ChatTabs from './ChatTabs.tsx';
import {Conversation} from "@/types/Conversation.ts";
import ChatHeader from "@/components/ChatHeader.tsx";

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
    tags: ["Team Lead", "Project Y"],
  });

  const selectedPersonInfo = useMemo(() => {
    if (selectedConversation) {
      return personInfo;
    }
    return null;
  }, [selectedConversation, personInfo]);

  return (
      <div className="flex flex-col h-full bg-white">
        <ChatHeader/>
        <div className="flex-1 flex border-l border-r border-gray-200">

          <div className="w-1/5 max-w-[280px] min-w-[200px] border-r border-gray-200">
            <ConversationList
                onSelect={handleConversationSelect}
            />
          </div>

          <div className="flex-1 flex flex-col h-full">
            <ChatTabs
                conversation={selectedConversation}
            />
          </div>

          <div className="w-1/5 max-w-[280px]  min-w-[200px] border-l border-gray-200">
            <PersonInfo
                personInfo={selectedPersonInfo}
            />
          </div>
        </div>
      </div>
  );
}

export default ChatWin;
