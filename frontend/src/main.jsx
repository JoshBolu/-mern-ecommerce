import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  //  StrictMode makes the site load twice and is normal in development — it won't happen in production.
  
    <BrowserRouter>
      <App/>
    </BrowserRouter>  
  
)