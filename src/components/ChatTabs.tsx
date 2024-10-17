import React, {useMemo, useState} from 'react';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Conversation} from '../types/Conversation.ts';
import ChatMessage from "@/components/ChatMessage.tsx";
import {useAtomState} from "@zedux/react";
import {selectedConversationIdState} from "@/atoms/selectedConversation.ts";
import ChatInput from "@/components/ChatInput.tsx";

interface ChatMessageProps {
  conversation: Conversation;
}

const ChatTabs: React.FC<ChatMessageProps> = ({conversation}) => {
  const [selectedConversationId, setSelectedConversationId] = useAtomState(selectedConversationIdState)

  const tabs = useMemo<string[]>(() => {
    if (conversation.tabs) {
      return conversation.tabs
    }
    return [conversation.lastMessageChannel === 'web' ? 'WebChat' : 'WhatsApp']
  }, [conversation])
  const [renderedTabs, setRenderedTabs] = useState<Set<string>>(new Set([conversation.conversationId]));
  console.log('renderTabs', renderedTabs)
  return (
      <>
        <Tabs value={conversation.conversationId} className='flex-1 flex flex-col'
              onValueChange={(value) => {
                setSelectedConversationId([selectedConversationId[0], +value])
                setRenderedTabs(prev => prev.add(value))
              }}>
          <div className="flex justify-center mt-4">
            <TabsList className="justify-center">
              {tabs.map((tab) => (<TabsTrigger value={tab.id} key={tab.id}>{tab.label}</TabsTrigger>))}
            </TabsList>
          </div>
          {tabs.map((tab) => {
            const tabValue = tab.id
            return (<TabsContent value={tabValue} key={tab.id} className="flex-1 relative">
              {renderedTabs.has(tabValue) && (
                  <ChatMessage id={tabValue}/>
              )}
            </TabsContent>)
          })}

        </Tabs>
        <ChatInput conversation={conversation}/>
      </>
  );
};

export default React.memo(ChatTabs);
