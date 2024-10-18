import markdownToHtml from "@/lib/markdown.ts";
import {CheckCheck, CircleAlert, Clock3, MessageSquareDot} from "lucide-react";
import {Message} from "@/types/Message.ts";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

interface ChatMessageItemProps {
  message: Message;
}

function getSenderName(message: Message) {
  switch (message.channel) {
    case 'web':
      return message.webClientSender?.name;
    case 'whatsappcloudapi':
      return message.dynamicChannelSender?.userDisplayName;
    default:
      return '';
  }
}

export default function ChatMessageItem({message}: ChatMessageItemProps) {
  const isSender = message.channel === 'web' ? message.isSentFromSleekflow : message.from === message.channelIdentityId;
  return (
      <div
          className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}
      >
        <div
            className={`max-w-[70%] min-w-[150px] p-3 rounded-lg ${
                isSender ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
        >
          {message.messageType === 'file'
              ? <div>file</div>
              : message.messageType === 'template'
                  ? <div className="text-sm"
                         dangerouslySetInnerHTML={{__html: markdownToHtml(message.messageContent || 'Template Sending...')}}/>
                  :
                  <div className="text-sm" dangerouslySetInnerHTML={{__html: markdownToHtml(message.messageContent)}}/>
          }
          <div className={`text-xs text-muted-foreground mt-1 flex items-center  ${isSender ? "justify-end" : ""} `}>
            {!isSender && <span
              className="mr-1">{getSenderName(message)}</span>}
            <span>{formatTime(message.updatedAt)}</span>
            {isSender && message.status === 'Read' && (
                <CheckCheck className="ml-1 size-4"/>
            )}
            {isSender && message.status === 'Sending' && (
                <Clock3 className="ml-1 size-4"/>
            )}
            {isSender && message.status === 'Failed' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleAlert className="ml-1 size-4 text-destructive"/>
                    </TooltipTrigger>
                    <TooltipContent className={"bg-accent text-destructive"}>
                      {message.meta.channelStatusMessage}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            )}
            {isSender && (message.status === 'Received' || message.status === 'Sent') && (
                <MessageSquareDot className="ml-1 size-4"/>
            )}
          </div>
        </div>
      </div>
  )
}
