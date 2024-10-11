import {useState, useEffect} from 'react';
import ConversationList from './ConversationList.tsx';
import PersonInfo from './PersonInfo.tsx';
import ChatTabs from './ChatTabs.tsx';
import {Conversation} from "@/types/Conversation.ts";
import ChatHeader from "@/components/ChatHeader.tsx";
import {socket} from "@/lib/socket.ts";
import {useAtomInstance, useAtomSelector} from "@zedux/react";
import {conversationState} from "@/atoms/conversations.ts";
import {getSelectedConversation} from "@/atoms/selectedConversation.ts";


// ... existing code ...

function ChatWin() {
  const selectedConversation = useAtomSelector(getSelectedConversation);
  const conversationInst = useAtomInstance(conversationState)


  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onConversation(value) {
      conversationInst.exports.prependConversation(value)
      console.log('conv', value)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('conversation', onConversation);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('conversation', onConversation);
    };
  }, []);


  return (
      <div className="flex flex-col h-full bg-white">
        <ChatHeader/>
        <div className="flex-1 flex border-l border-r border-gray-200">

          <div className="w-1/5 max-w-[280px] min-w-[200px] border-r border-gray-200">
            <ConversationList />
          </div>

          <div className="flex-1 flex flex-col h-full">
            {selectedConversation ? <ChatTabs
                conversation={selectedConversation}
            /> : <div className="flex-1 flex items-center justify-center">Select a conversation</div>}
          </div>

          <div className="w-1/5 max-w-[280px]  min-w-[200px] border-l border-gray-200">
            <PersonInfo
                personInfo={selectedConversation?.userProfile}
                tags={selectedConversation?.conversationHashtags}
            />
          </div>
        </div>
      </div>
  );
}

export default ChatWin;
