import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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

function AppContent() {
  const { user, loading, isMobile } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  // First-time admin setup
  if (!user?.initialized) {
    return (
      <Routes>
        <Route 
          path="/" 
          element={
            isMobile ? 
              <MobileFirstAdminSetup /> : 
              <DesktopFirstAdminSetup />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Authenticated routes
  if (user?.isAuthenticated) {
    return (
      <Routes>
        <Route 
          path="/" 
          element={
            isMobile ? 
              <MobileLayout><MobileDashboard /></MobileLayout> : 
              <DesktopLayout><DesktopDashboard /></DesktopLayout>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Login routes
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isMobile ? 
            <MobileLogin /> : 
            <DesktopLogin />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
