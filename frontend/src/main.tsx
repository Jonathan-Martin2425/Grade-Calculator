import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root');
root !== null ? createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
:
null