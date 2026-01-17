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

// Mobile Components
import { MobileFirstAdminSetup } from './components/mobile/auth/MobileFirstAdminSetup'
import { MobileLogin } from './components/mobile/auth/MobileLogin'
import { MobileDashboard } from './components/mobile/dashboard/MobileDashboard'

// Desktop Components
import { DesktopFirstAdminSetup } from './components/desktop/auth/DesktopFirstAdminSetup'
import { DesktopLogin } from './components/desktop/auth/DesktopLogin'
import { DesktopDashboard } from './components/desktop/dashboard/DesktopDashboard'

// Layout Components
import { MobileLayout } from './components/layout/MobileLayout'
import { DesktopLayout } from './components/layout/DesktopLayout'

function App() {
  return (
    <BrowserRouter>
      <AppContent />
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
    return isMobile ? <MobileFirstAdminSetup /> : <DesktopFirstAdminSetup />
  }
  
  // Authenticated routes
  if (user?.isAuthenticated) {
    return isMobile ? 
      <MobileLayout><MobileDashboard /></MobileLayout> : 
      <DesktopLayout><DesktopDashboard /></DesktopLayout>
  }
  
  // Login routes
  return isMobile ? <MobileLogin /> : <DesktopLogin />
}

export default App
