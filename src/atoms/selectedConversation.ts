import {atom, AtomGetters} from "@zedux/react";
import {conversationsState} from "./conversations.ts";
import {Conversation} from "../types/Conversation";

export const selectedConversationIdState = atom<[string, number?]>('selectedConversationId', [''])

export const getSelectedConversation = ({get}: AtomGetters) => {
  const id = get(selectedConversationIdState)
  const [cid, idx = 0] = id
  if(!cid) {
    return null
  }
  const conversations = get(conversationsState)
  const conv = conversations.find((c: Conversation) => c.conversationId === cid)
  if(conv.contacts) {
    return {
      ...conv.contacts[idx],
      tabs: conv.contacts.map(c => ({label: `WhatsApp (${c.relation})`, id: c.conversationId}))
    }
  }
  return conv
}
