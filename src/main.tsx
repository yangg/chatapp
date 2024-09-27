
import { createRoot, Root } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

let appRoot: Root

export function render(root: HTMLElement) {
  appRoot = createRoot(root)
  appRoot.render(
    <App />
  )
}

export function unmount() {
  appRoot.unmount()
}


if (import.meta.env.MODE === 'development' || import.meta.env.BASE_URL !== '/') {
  render(document.getElementById('root')!)
}