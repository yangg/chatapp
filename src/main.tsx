
import { createRoot, Root } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

let appRoot: Root

interface ChatAppOptions {
  conversations?: []
}

export function render(root: HTMLElement, options: ChatAppOptions = {}) {
  appRoot = createRoot(root)
  appRoot.render(
    <App types={options.conversations} />
  )
}

export function unmount() {
  appRoot.unmount()
}


if (import.meta.env.MODE === 'development' || import.meta.env.BASE_URL !== '/') {
  render(document.getElementById('root')!)
}
