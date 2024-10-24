import markdownToHtml from "@/lib/markdown.ts";
import {CheckCheck, CircleAlert, Clock3, MessageSquareDot, Paperclip} from "lucide-react";
import {Message, MessageFile} from "@/types/Message.ts";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {last} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";

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
          {message.messageContent &&
            <div className="text-sm" dangerouslySetInnerHTML={{__html: markdownToHtml(message.messageContent)}}/>}
          {message.messageType === 'file' && <MessageFiles files={message.files}/>
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
                      {message.statusMessage}
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

function MessageFiles({files}: { files: MessageFile[]}) {
  return (
      <div className={'space-y-3'}>
        {files.map((file) => {
          const name = last(file.filename.split('/'));
          if(file.mimeType.includes('image/')) {
            return (
              <img loading="lazy" key={file.fileId} src={file.url} alt={name} title={name} style={{width: file.metadata.width, aspectRatio: file.metadata.width/file.metadata.height}} />
            )
          } else {
            return (
                <button key={file.fileId} className={'flex text-sm items-center'} onClick={() => window.open(file.url)}>
                  <Paperclip className={'size-4 mr-1'}/>
                  {name}
                </button>
            )
          }
        })}
      </div>
  )
}
