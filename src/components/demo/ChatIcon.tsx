import { useState, useEffect, lazy, Suspense, useMemo } from 'react'
import { MessageCircle } from 'lucide-react'
import ShadowComponent from './ShadowComponent'

const ChatApp = lazy(() => import('./ChatApp'))

interface ChatIconProps {
  onToggleChat: () => void
}

export default function ChatIcon({ onToggleChat }: ChatIconProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Simulating receiving new messages
    const interval = setInterval(() => {
      setUnreadCount((prev) => prev + 1)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleToggleChat = () => {
    setShowChat((prev) => !prev)
    // onToggleChat()
    setUnreadCount(0)
  }

  // Memoize the ChatApp component
  const memoizedChatApp = useMemo(() => (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatApp />
    </Suspense>
  ), [])

  return (
    <>
      <div
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-3 cursor-pointer shadow-lg"
        onClick={handleToggleChat}
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </div>
      {showChat && (
        <ShadowComponent>
          {memoizedChatApp}
        </ShadowComponent>
      )}
    </>
  )
}