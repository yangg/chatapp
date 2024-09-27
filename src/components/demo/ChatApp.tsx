import React, { useEffect, useRef } from 'react'

const CHAT_APP_BaseUrl = 'https://d2w7chn7hohz6a.cloudfront.net/chatapp'

declare global {
  interface Window {
    ChatApp: any // Replace 'any' with the actual type of your UMD chat app if known
  }
}

const ChatApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement>(null)

  useEffect(() => {
    // Load JavaScript
    const script = document.createElement('script')
    script.src = `${CHAT_APP_BaseUrl}/chatapp.umd.js`
    script.async = true
    script.onload = () => {
      if (window.ChatApp && containerRef.current) {
        window.ChatApp.render(containerRef.current)
      } else {
        console.error('ChatApp not found or container not available')
      }
    }
    document.body.appendChild(script)


    styleRef.current!.textContent = `
      @import '${CHAT_APP_BaseUrl}/style.css';
      #chat_app { width: 90vw; height: 50vh; position: fixed; bottom: 0; right: 0; border: 1px solid #ddd; z-index: 1000; }
    `

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      <style ref={styleRef}></style>
      <div id="chat_app" ref={containerRef}></div>
    </>
  )
}

export default ChatApp
