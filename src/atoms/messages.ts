import {
  atom,
  injectStore,
  api,
  injectCallback,
  injectAtomSelector,
} from "@zedux/react";
import {Message, NewMessage, TextMessage, TemplateMessage} from "@/types/Message.ts";
import axios from "axios";
import {Conversation} from "@/types/Conversation.ts";
import {getSelectedConversation} from "@/atoms/selectedConversation.ts";


export const messageState = atom('messages', () => {
  const store = injectStore<Message[]>([])
  // cannot get update atom selector here, so pass as a parameter in sendMessage
  // const conversation = injectAtomSelector(getSelectedConversation)

  const appendMessage = (items: Message[]) => {
    return store.setState((state) => [...state, ...items])
  }

  const prependMessage = (items: Message[]) => {
    const newIds = items.reduce((acc, item) => (acc[item.id] = 1, acc), {} as Record<string, 1>)
    return store.setState((state) => {
      const removeUpdatedState = state.filter(item => !newIds[item.id])
      return [...items, ...removeUpdatedState]
    })
  }

  const sendMessage = injectCallback(async(newMessage: TextMessage | TemplateMessage, conversation: Conversation) => {
    console.log('send', conversation.conversationId, conversation.title)
    const channel = conversation.lastMessageChannel
    const message: NewMessage = {
      ...newMessage,
      ...(channel === 'web' ? {
        channel,
        webClientSenderId: conversation.webClientUUID,
      }: {
        channel,
        from: conversation.channelIdentityId,
        channelIdentityId: conversation.channelIdentityId,
        to: conversation.userIdentityId,
      })
    }
    const newMessageId = Date.now()
    prependMessage([
      {
        ...message,
        isSentFromSleekflow: true,
        updatedAt: new Date().toISOString(),
        status: 'Sending',
        timestamp: Math.floor(newMessageId / 1000),
        id: newMessageId,
      },
    ])
    const {data} = await axios.post('/sleekflow/message', message);
    store.setState(prevMessages => prevMessages.map(x => x.id === newMessageId ? {...message, ...data} : x))
  })

  return api(store).setExports({
    appendMessage,
    prependMessage,
    clearMessage: () => store.setState([]),
    sendMessage,
    setState: store.setState,
  })
})
