import {atom, injectStore, api} from "@zedux/react";
import {Message} from "@/types/Message.ts";


export const messageState = atom('messages', () => {
  const store = injectStore<Message[]>([])

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

  return api(store).setExports({
    appendMessage,
    prependMessage,
    clearMessage: () => store.setState([]),
    setState: store.setState,
  })
})
