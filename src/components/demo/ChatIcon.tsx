import { useState, useEffect, useMemo } from 'react'
import { MessageCircle } from 'lucide-react'
import ShadowComponent from './ShadowComponent'

import ChatApp from './ChatApp'



export default function ChatIcon({ themeColor }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    async function getUnread() {
      const token = (document.cookie.match(/Token=([^;]+)/) || [0, ''])[1]
      const res = await fetch('https://chat-api.17ch.cn/sleekflow/unread', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(res.ok) {
        const data = await res.json()
        setUnreadCount(data.unreadCount)
      }
    }

    const interval = setInterval(getUnread, 10000)
    getUnread()

    return () => clearInterval(interval)
  }, [])

  const handleToggleChat = () => {
    if(!showChat) {
      setShowChat(true)
    } else {
      window.ChatApp.toggleChat()
    }
  }

  // Memoize the ChatApp component
  const memoizedChatApp = useMemo(() => (
    <ChatApp />
  ), [])

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '1rem', // bottom-4
          right: '1rem', // right-4
          backgroundColor: themeColor || '#007bff', // bg-primary
          color: 'white', // text-primary-foreground
          borderRadius: '9999px', // rounded-full
          padding: '0.75rem', // p-3
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' // shadow-lg
        }}
        onClick={handleToggleChat}
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-0.5rem', // -top-2
            right: '-0.5rem', // -right-2
            backgroundColor: '#f56565', // bg-red-500
            color: 'white',
            borderRadius: '9999px', // rounded-full
            width: '1.5rem', // w-6
            height: '1.5rem', // h-6
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem' // text-xs
          }}>
            {unreadCount}
          </span>
        )}
      </div>
      {showChat && (
        <ShadowComponent themeColor={themeColor}>
          {memoizedChatApp}
        </ShadowComponent>
      )}
    </>
  )
}
