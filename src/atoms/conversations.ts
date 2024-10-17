import {atom, injectStore, api} from "@zedux/react";
import {Conversation} from "@/types/Conversation.ts";


export const conversationsState = atom('conversation', () => {
  const store = injectStore<Conversation[]>([])

  const appendConversation = (items: Conversation[]) => {
    return store.setState((state) => [...state, ...items])
  }

  const prependConversation = (items: Conversation[]) => {
    const newIds = items.reduce((acc, item) => (acc[item.conversationId] = 1, acc), {} as Record<string, 1>)
    return store.setState((state) => {
      const removeUpdatedState = state.filter(item => !newIds[item.conversationId])
      return [...items, ...removeUpdatedState]
    })
  }

  return api(store).setExports({
    appendConversation,
    prependConversation,
    clearConversation: () => store.setState([])
  })
})
