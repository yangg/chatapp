import {atom, AtomGetters} from "@zedux/react";

export const selectedConversationTypeIdState = atom('selectedConversationType', "File Message")

export const conversationTypesState = atom('conversationTypes', [{
  title: 'General'
},{
  title: 'File Message',
  getData: 1,
}])


export const getSelectedConversationType = ({get}: AtomGetters) => {
  const id = get(selectedConversationTypeIdState)
  const types = get(conversationTypesState)
    return types.find(x => x.title === id)
}
