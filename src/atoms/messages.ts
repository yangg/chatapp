import {
  atom,
  injectStore,
  api,
  injectCallback,
} from "@zedux/react";
import {Message, NewMessage, TextMessage, TemplateMessage} from "@/types/Message.ts";
import axios from "axios";
import {Conversation} from "@/types/Conversation.ts";


export const messageState = atom('messages', (_id: string) => {
  const store = injectStore<Message[]>([])
  // cannot get update atom selector here, so pass as a parameter in sendMessage
  // const conversation = injectAtomSelector(getSelectedConversation)

  const appendMessage = (items: Message[]) => {
    return store.setState((state) => [...state, ...items])
  }

  const prependMessage = (newItems: Message[]) => {
    const newIds = newItems.reduce((acc, item) => (acc[item.id] = 1, acc), {} as Record<string, 1>)
    return store.setState((state) => {
      const removeDuplicated = state.filter(item => !newIds[item.id])
      return [...newItems, ...removeDuplicated]
    })
  }

  const sendMessage = injectCallback(async(newMessage: TextMessage | TemplateMessage, conversation: Conversation) => {
    console.log('send', conversation.conversationId, conversation.title)
    const channel = conversation.channel
    const message: NewMessage = {
      ...newMessage,
      ...(channel === 'web' ? {
        channel,
        webClientSenderId: conversation.userIdentityId,
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
}, { ttl: 0})
