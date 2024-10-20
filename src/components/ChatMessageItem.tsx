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



export default function ChatMessageItem({message}: ChatMessageItemProps) {
  const isOurs = message.isOurs
  return (
      <div
          className={`flex mb-4 ${isOurs ? "justify-end" : "justify-start"}`}
      >
        <div
            className={`max-w-[70%] min-w-[150px] p-3 rounded-lg ${
                isOurs ? "bg-primary text-primary-foreground" : "bg-muted"
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
          <div className={`text-xs text-muted-foreground mt-1 flex items-center  ${isOurs ? "justify-end" : ""} `}>
            {!isOurs && <span
              className="mr-1">{message.name}</span>}
            <span>{formatTime(message.updatedAt)}</span>
            {isOurs && message.status === 'Read' && (
                <CheckCheck className="ml-1 size-4"/>
            )}
            {isOurs && message.status === 'Sending' && (
                <Clock3 className="ml-1 size-4"/>
            )}
            {isOurs && message.status === 'Failed' && (
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
            {isOurs && (message.status === 'Received' || message.status === 'Sent') && (
                <MessageSquareDot className="ml-1 size-4"/>
            )}
          </div>
        </div>
      </div>
  )
}
