import {Textarea} from "@/components/ui/textarea.tsx";
import TemplateList from "@/components/TemplateList.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMemo, useState} from "react";
import {TextMessage} from "@/types/Message.ts";
import {useAtomInstance} from "@zedux/react";
import {messageState} from "@/atoms/messages.ts";
import {Conversation} from "@/types/Conversation.ts";
import {ClipboardCopy, Paperclip, X} from "lucide-react";


const ChatInput = ({conversation}: { conversation: Conversation}) => {

  const {sendMessage} = useAtomInstance(messageState, [conversation.conversationId]).exports
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const isSendable = useMemo(() => {
    return (newMessage.length > 0 || files.length) && (conversation.lastContactFromCustomers ? (Date.now() - new Date(conversation.lastContactFromCustomers) < 24*3600*1000) : true)
  }, [newMessage, files, conversation.lastContactFromCustomers]);

  const onSendMessage = () => {
    const params: TextMessage = {
      messageType: files.length > 0 ? 'file' : 'text',
      files,
      messageContent: newMessage,
    }
    setNewMessage('')
    setFiles([])
    sendMessage(params, conversation)
  }

  return (
      <div className='p-4'>
        <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="mb-2"
        />
        <div className="flex flex-wrap space-x-2">
          <MessageFile files={files} setFiles={setFiles}/>
          <Button variant={'outline'} size={'icon'} className={'relative'} >
            <input type='file' className={'absolute inset-0 opacity-0'}
                   multiple
                   accept={'.png,.jpg,.mp3,.pdf'}
                   onChange={(e) => {
                     setFiles(x => [...x, ...(e.target.files || [])])
                     // e.target.value = ''
                   }}/>
            <Paperclip/>
          </Button>
          {conversation.channel !== 'web' && <TemplateList/>}
          <Button onClick={onSendMessage} disabled={!isSendable}>
            Send
          </Button>
        </div>
      </div>
  )
}

function MessageFile({files, setFiles}) {
  return (
    <div className={'space-y-2 text-muted-foreground flex-1'}>
    {files.map((file, index) => (
      <div className={'flex items-center group'} key={index}>
        <span>{file.name}</span>
        <Button className={'ml-1 hidden group-hover:inline-flex'} variant="ghost" size={'xsIcon'}
                onClick={() => setFiles(x => x.filter((_, i) => i !== index))}>
          <X className={'size-4'} /></Button>
      </div>)
    )}
    </div>
  )
}


export default ChatInput
