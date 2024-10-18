import {Textarea} from "@/components/ui/textarea.tsx";
import TemplateList from "@/components/TemplateList.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMemo, useState} from "react";
import {TextMessage} from "@/types/Message.ts";
import {useAtomInstance} from "@zedux/react";
import {messageState} from "@/atoms/messages.ts";
import {Conversation} from "@/types/Conversation.ts";


const ChatInput = ({conversation}: { conversation: Conversation}) => {

  const {sendMessage} = useAtomInstance(messageState, [conversation.conversationId]).exports
  const [newMessage, setNewMessage] = useState('');
  const isSendable = useMemo(() => newMessage.trim().length === 0, [newMessage]);

  const onSendMessage = () => {
    const params: TextMessage = {
      messageType: 'text',
      messageContent: newMessage,
    }
    setNewMessage('')
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
        <div className="flex justify-end space-x-2">
          {conversation.channel !== 'web' && <TemplateList/>}
          <Button onClick={onSendMessage} disabled={isSendable}>
            Send
          </Button>
        </div>
      </div>
  )
}


export default ChatInput
