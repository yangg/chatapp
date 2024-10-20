import {atom, AtomGetters} from "@zedux/react";

export const selectedConversationTypeIdState = atom('selectedConversationType', "General")

export const conversationTypesState = atom('conversationTypes', [{
  title: 'General'
},{
  title: 'File Message',
  getData: 'https://n8n.a4apple.cn/webhook/sleekflow-file',
}])


export const getSelectedConversationType = ({get}: AtomGetters) => {
  const id = get(selectedConversationTypeIdState)
  const types = get(conversationTypesState)
  return types.find(x => x.title === id)
}
