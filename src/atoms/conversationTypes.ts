import {atom, AtomGetters} from "@zedux/react";


const defaultConversationTypes = [
    {
  title: 'General'
},
  {
    title: 'File Message',
    // getData: 'https://n8n.a4apple.cn/webhook/sleekflow-file',
    getData: 'https://dsp-file-dev.a4apple.cn:64403/api/irmsdev2/chatWidget/filecontacts'
  }]

export const selectedConversationTypeIdState = atom('selectedConversationType', defaultConversationTypes[0].title)

export const conversationTypesState = atom('conversationTypes', defaultConversationTypes)


export const getSelectedConversationType = ({get}: AtomGetters) => {
  const id = get(selectedConversationTypeIdState)
  const types = get(conversationTypesState)
  return types.find(x => x.title === id)
}
