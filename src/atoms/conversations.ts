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

  const mergeConversationToContacts = (updated: Conversation[]) => {
    return store.setState((state) => {
      const updatedObjects = updated.reduce((acc, item) => (acc[item.userIdentityId] = item, acc), {})
      const newState = state.map(c => {
        const needUpdated = c.contacts.some(c => c.userIdentityId in updatedObjects)
        if(!needUpdated) {
          return c
        }
        let modifiedAts = []
        const newItem = {
          ...c,
          // modifiedAt: needUpdatedItems[c.conversationId],
          contacts: c.contacts.map(x => {
            if(x.userIdentityId in updatedObjects) {
              const updatedItem = updatedObjects[x.userIdentityId]
              modifiedAts.push(updatedItem.modifiedAt)
              return {
                ...x,
                conversationId: updatedItem.conversationId,
              }
            }
            return x
          }),
          modifiedAt: modifiedAts.reduce((max, c) => c > max ?  c : max) // max modifiedAt
        }
        return newItem
      })
      return newState
    })
  }

  return api(store).setExports({
    appendConversation,
    prependConversation,
    mergeConversationToContacts,
    clearConversation: () => store.setState([])
  })
})
