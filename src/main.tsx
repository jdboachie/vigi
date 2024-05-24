import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'cal-sans'
import { ThemeProvider } from './components/theme/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner'
import { SettingsProvider } from './components/settings-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <SettingsProvider>
        <Toaster richColors closeButton />
        <App />
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
