
import './App.css'
import ChatWin from './components/ChatWin'
import './lib/axios';
import {useEffect} from "react";
import {useAtomInstance} from "@zedux/react";
import {conversationTypesState} from "@/atoms/conversationTypes.ts";

function App() {
  const conversationTypes = useAtomInstance(conversationTypesState)
  useEffect(() => {
    // conversationTypes.setState(prevState => [...prevState, {
    //   title: 'File Message',
    //   getData: 1,
    // }])
  }, []);
  return (
    <>
      {/* <DemoApp/> */}
      <ChatWin />
    </>
  )
}

export default App
