import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/martian-mono/wght.css'
import '@fontsource-variable/archivo/wght.css'
import './index.css'
import './jp.css'
import './jp-hero.css'
import App from './App.jsx'

document.documentElement.classList.add('js')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
