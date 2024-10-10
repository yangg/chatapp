import React from 'react';
import { Message } from '../types/Message';
import markdownToHtml from '../lib/markdown';
import { CheckCheck, CircleAlert, Clock3, MessageSquareDot } from 'lucide-react';

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface ChatMessageProps {
  messages: Message[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messages }) => {

  return (
    <>
      {messages.map((message) => {
        const isSender = message.channel === 'web' ? message.isSentFromSleekflow : message.from === message.channelIdentityId;
        return (
          <div
          key={message.id}
          className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] min-w-[150px] p-3 rounded-lg ${
              isSender ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            { message.messageType === 'file' 
            ? <div>file</div> 
            : <div className="text-sm" dangerouslySetInnerHTML={{ __html: markdownToHtml(message.messageContent) }} />
            }
            <div className={`text-xs text-muted-foreground mt-1 flex items-center  ${isSender ? "justify-end" : ""} `}>
              {!isSender && <span className="mr-1">{message.dynamicChannelSender?.userDisplayName || message.webClientSender.name}</span> }
              <span>{formatTime(message.updatedAt)}</span>
              {isSender && message.status === 'Read' && (
                <CheckCheck className="ml-1 size-4" />
              )}
              {isSender && message.status === 'Sending' && (
                <Clock3 className="ml-1 size-4" />
              )}
              {isSender && message.status === 'Failed' && (
                <CircleAlert className="ml-1 size-4 text-destructive" />
              )}
              {isSender && message.status === 'Received' && (
                <MessageSquareDot className="ml-1 size-4" />
              )}
            </div>
          </div>
        </div>
        )
      })}
    </>
  );
};

export default ChatMessage;
