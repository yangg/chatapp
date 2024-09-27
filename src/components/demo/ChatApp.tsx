import React, { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
const CHAT_APP_BaseUrl = 'https://d2w7chn7hohz6a.cloudfront.net/chatapp'

declare global {
  interface Window {
    ChatApp: {
      render: (container: HTMLDivElement) => void
      toggleChat: () => void
      toggleMaximize: () => void
    }
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
        window.ChatApp.toggleChat = function() {
          containerRef.current!.classList.toggle('hidden');
        }
        window.ChatApp.toggleMaximize = function() {
          containerRef.current!.classList.toggle('maximized');
        }
      } else {
        console.error('ChatApp not found or container not available')
      }
    }
    document.body.appendChild(script)


    styleRef.current!.textContent = `
      @import '${CHAT_APP_BaseUrl}/style.css';
      #chat_app { height: 60vh; position: fixed; z-index: 1000; 
      left: 20px; bottom: 0; right: 20px; }
      #chat_app.hidden { display: none; }
      #chat_app.maximized { height: calc(100vh - 20px); }
      #chat_loader {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      #chat_loader .icon {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      #chat_loader span {
        font-size: 18px;
        font-weight: 500;
      }
    `

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      <style ref={styleRef}></style>
      <div id="chat_app" ref={containerRef}>
        <div id="chat_loader">
          <Loader2 className="icon" />
          <span>Loading Chat...</span>
        </div>
      </div>
    </>
  )
}

export default ChatApp
