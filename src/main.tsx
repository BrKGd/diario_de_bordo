import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Certifique-se que o App.tsx está na mesma pasta (src)
import './styles/app.css' // Verifique se o caminho do CSS está correto

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)