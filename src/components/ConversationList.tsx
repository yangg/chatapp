import React, {useState, useEffect} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Conversation} from '../types/Conversation';
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge"
import {getInitials} from '../lib/utils';
import {useAsyncFn} from 'react-use';
import axios from 'axios';
import {CircleAlert, Loader2} from "lucide-react";
import {useAtomState} from "@zedux/react";
import {conversationState} from "@/atoms/conversations.ts";
import {selectedConversationIdState} from "@/atoms/selectedConversation.ts";


const ConversationList: React.FC = () => {
  const [conversations, {appendConversation, clearConversation}] = useAtomState(conversationState);
  const [state, doFetch] = useAsyncFn(async () => {
    const {data} = await axios.get('/sleekflow/conversation', {
      params: {
        orderBy: 'desc',
        limit: 30,
      }
    });
    // await new Promise(resolve => setTimeout(resolve, 100000));
    appendConversation(data)
    return
  }, []);

  const [selectedConversationId, setSelectedConversationId] = useAtomState(selectedConversationIdState);
  const [selectedType, setSelectedType] = useState<string>('general');


  useEffect(() => {
    console.log('fetching conversations3');
    clearConversation();
    doFetch();
  }, []);
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].conversationId);
    }
  }, [conversations])

  return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-gray-200">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="file">File Message</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 relative">
          <div className='overflow-y-auto absolute top-0 left-0 right-0 bottom-0 flex flex-col'>
            {conversations.map((conv) => (
                <button
                    key={conv.conversationId}
                    className={`flex items-center w-full p-3 hover:bg-accent ${
                        selectedConversationId === conv.conversationId ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedConversationId(conv.conversationId)}
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
            <div
                className={`flex justify-center items-center empty:hidden ${conversations.length === 0 ? 'flex-1' : ''}`}>
              {state.loading && <><Loader2 className="h-6 w-6 animate-spin"/> <span
                className={'text-xs ml-2'}>Loading...</span></>}
              {state.error && <><CircleAlert className="ml-1 size-4 text-destructive"/><span
                className={'text-xs ml-2 text-destructive'}>{state.error.message}</span></>}
            </div>

          </div>
        </div>
      </div>
  );
};

export default ConversationList;
