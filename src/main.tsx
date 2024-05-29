import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'cal-sans'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { SettingsProvider } from './components/settings-context.tsx'
import { ThemeProvider } from './components/theme/theme-provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <TooltipProvider delayDuration={200}>
        <SettingsProvider>
          <Toaster richColors closeButton />
          <App />
        </SettingsProvider>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
