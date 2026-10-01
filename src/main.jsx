import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { ContentProvider } from './store/ContentContext.jsx'
import { AuthProvider } from './store/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ContentProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContentProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
