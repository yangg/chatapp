
import { createRoot, Root } from 'react-dom/client'
import DemoApp from './DemoApp.tsx'
import '../../index.css'

let appRoot: Root

export function render(root: HTMLElement) {
  appRoot = createRoot(root)
  appRoot.render(
    <DemoApp />
  )
}

render(document.getElementById('root')!)