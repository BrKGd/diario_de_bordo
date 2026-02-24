import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register' // Importado para suporte PWA
import App from './App'
import './styles/app.css'

// Registo imediato do Service Worker para o funcionamento do PWA
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O basename foi alterado para "/daily-report-v2/" para coincidir 
      exatamente com o nome do teu repositório no GitHub. 
    */}
    <BrowserRouter basename="/daily-report-v2/">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)