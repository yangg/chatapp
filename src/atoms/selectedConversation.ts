import {atom, AtomGetters} from "@zedux/react";
import {conversationState} from "./conversations.ts";
import {Conversation} from "../types/Conversation";

export const selectedConversationIdState = atom<string>('selectedConversationId', '')

export const getSelectedConversation = ({get}: AtomGetters) => {
  const id = get(selectedConversationIdState)
  if(!id) {
    return null
  }
  return get(conversationState).find((c: Conversation) => c.conversationId === id)
}
