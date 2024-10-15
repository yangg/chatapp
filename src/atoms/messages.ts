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
    console.log('send', conversation.conversationId, conversation.userProfile?.firstName)
    const channel = conversation.lastMessageChannel
    const message: NewMessage = {
      ...newMessage,
      ...(channel === 'web' ? {
        channel,
        webClientSenderId: conversation.userProfile.webClient.webClientUUID,
      }: {
        channel,
        from: conversation.lastChannelIdentityId,
        channelIdentityId: conversation.lastChannelIdentityId,
        to: conversation.userProfile.whatsappCloudApiUser.userIdentityId,
      })
    }
    const newMessageId = Date.now()
    console.log(33, {
      ...message,
      isSentFromSleekflow: true,
      updatedAt: new Date().toISOString(),
      status: 'Sending',
      timestamp: newMessageId / 1000,
      id: newMessageId,
    },)
    prependMessage([
      {
        ...message,
        isSentFromSleekflow: true,
        updatedAt: new Date().toISOString(),
        status: 'Sending',
        timestamp: newMessageId / 1000,
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
