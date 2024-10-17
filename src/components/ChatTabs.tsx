import React, {useMemo, useState} from 'react';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Conversation} from '../types/Conversation.ts';
import {TextMessage} from "@/types/Message.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import TemplateList from "@/components/TemplateList.tsx";
import {Button} from "@/components/ui/button.tsx";
import ChatMessage from "@/components/ChatMessage.tsx";
import {useAtomInstance, useAtomState} from "@zedux/react";
import {messageState} from "@/atoms/messages.ts";
import {selectedConversationIdState} from "@/atoms/selectedConversation.ts";

interface ChatMessageProps {
  conversation: Conversation;
}

const ChatTabs: React.FC<ChatMessageProps> = ({conversation}) => {
  const messagesInst = useAtomInstance(messageState).exports
  const [selectedConversationId, setSelectedConversationId] = useAtomState(selectedConversationIdState)

  const tabs = useMemo<string[]>(() => {
    if (conversation.tabs) {
      return conversation.tabs
    }
    return [conversation.lastMessageChannel === 'web' ? 'WebChat' : 'WhatsApp']
  }, [conversation])
  const [renderedTabs, setRenderedTabs] = useState<Set<string>>(new Set());
  const [newMessage, setNewMessage] = useState('');
  const isSendable = useMemo(() => newMessage.trim().length === 0, [newMessage]);

  const sendMessage = () => {
    const params: TextMessage = {
      messageType: 'text',
      messageContent: newMessage,
    }
    setNewMessage('')
    messagesInst.sendMessage(params, conversation)
  }

  console.log(tabs, conversation)
  return (
      <>
        <Tabs value={(selectedConversationId[1] || 0).toString()} className='flex-1 flex flex-col'
              onValueChange={(value) => {
                setSelectedConversationId([selectedConversationId[0], +value])
                setRenderedTabs(prev => prev.add(value))
              }}>
          <div className="flex justify-center mt-4">
            <TabsList className="justify-center">
              {tabs.map((tab, i) => (<TabsTrigger value={i.toString()} key={tab}>{tab}</TabsTrigger>))}
            </TabsList>
          </div>
          {tabs.map((tab, i) => {
            const tabValue = i.toString()
            return (<TabsContent value={tabValue} key={tab} className="flex-1 relative">
              {renderedTabs.has(tabValue) && (
                  <ChatMessage/>
              )}
            </TabsContent>)
          })}

        </Tabs>
        {/* Message Input */}
        <div className='p-4'>
          <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="mb-2"
          />
          <div className="flex justify-end space-x-2">
            {conversation.lastMessageChannel !== 'web' && <TemplateList/>}
            <Button onClick={sendMessage} disabled={isSendable}>
              Send
            </Button>
          </div>
        </div>
      </>
  );
};

export default ChatTabs;
