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
        const modifiedAts = []
        const newContacts = c.contacts.map(x => {
          if(x.userIdentityId in updatedObjects) {
            const updatedItem = updatedObjects[x.userIdentityId]
            modifiedAts.push(updatedItem.modifiedAt)
            return {
              ...x,
              ...updatedItem,
            }
          }
          return x
        })
        return  {
          ...c,
          contacts: newContacts,
          unreadCount: newContacts.reduce((sum, c) => sum + c.unreadCount, 0),
          modifiedAt: modifiedAts.reduce((max, c) => c > max ?  c : max) // max modifiedAt
        }
      })
      return newState
    })
  }

  const setRead = (selectedConversationId: [string, number?]) => {
    const [id, idx = 0] = selectedConversationId
    return store.setState((state) => {
      return state.map(c => {
        if(c.conversationId !== id) {
          return c
        }
        if(!c.contacts) {
          return {
            ...c,
            unreadCount: 0
          }
        }
        let unreadCount = 0
        return {
          ...c,
          contacts: c.contacts.map((x, i) => {
            if(i !== idx) {
              return x
            }
            unreadCount = x.unreadCount
            return {
              ...x,
              unreadCount: 0
            }
          }),
          unreadCount: c.unreadCount - unreadCount
        }
      })
    })
  }

  return api(store).setExports({
    appendConversation,
    prependConversation,
    mergeConversationToContacts,
    clearConversation: () => store.setState([]),
    setRead,
  })
})
