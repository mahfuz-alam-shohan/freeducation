import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
  )
}

function AppContent() {
  const { user, loading, isMobile } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  // First-time admin setup
  if (!user?.initialized) {
    return isMobile ? <div>Mobile Setup</div> : <div>Desktop Setup</div>
  }
  
  // Authenticated routes
  if (user?.isAuthenticated) {
    return isMobile ? <div>Mobile Dashboard</div> : <div>Desktop Dashboard</div>
  }
  
  // Login routes
  return isMobile ? <div>Mobile Login</div> : <div>Desktop Login</div>
}

export default App
