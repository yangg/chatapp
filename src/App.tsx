
import './App.css'
import ChatWin from './components/ChatWin'
import './lib/axios';
import {useAtomInstance} from "@zedux/react";
import {conversationTypesState, selectedConversationTypeIdState} from "@/atoms/conversationTypes.ts";

function App({types}) {
  const conversationTypes = useAtomInstance(conversationTypesState)
  const selectedConversationTypeId = useAtomInstance(selectedConversationTypeIdState)
  if(types) {
    selectedConversationTypeId.setState(types[0].title)
    conversationTypes.setState(types)
  }
  return (
    <>
      {/* <DemoApp/> */}
      <ChatWin />
    </>
  )
}

export default App
