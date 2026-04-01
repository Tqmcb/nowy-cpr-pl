import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AppWrapper } from './AppWrapper.tsx'
import '@fontsource-variable/inter'
import '@fontsource-variable/outfit'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AppWrapper />
    </HelmetProvider>
  </StrictMode>,
)
