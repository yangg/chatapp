
import {Button} from "@/components/ui/button.tsx";
import {Maximize2, Minimize2, Settings, X} from "lucide-react";
import {lazy, Suspense, useState} from "react";
import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";


const DynamicDialogContent = lazy(() => import('./Settings.tsx'))

export default function ChatHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isClosed, setIsClosed] = useState(false)


  const toggleMaximize = () => {
    window.ChatApp.toggleMaximize()
    setIsMaximized(!isMaximized)
  }

  const closeChatWindow = () => {
    window.ChatApp.toggleChat()
    setIsClosed(true)
  }
  return (
    <div className="flex items-center justify-between bg-primary text-primary-foreground p-2 pl-3 rounded-t">
        <h1 className="text-medium font-semibold">Chat Window</h1>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="size-6" onClick={() => setIsOpen(true)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-6" onClick={toggleMaximize}>
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-6" onClick={closeChatWindow}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <Suspense fallback={<Skeleton className="w-full h-[100px]" />}>
              <DynamicDialogContent setIsOpen={setIsOpen} />
            </Suspense>
          </DialogContent>
        </Dialog>
      </div>
  )
}
