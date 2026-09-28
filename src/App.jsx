import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteLayout from './components/Layout'
import { AuthProvider, RequireAuth } from './lib/auth'
import { Login, Register } from './pages/Auth'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Certificates from './pages/portal/Certificates'
import Course from './pages/portal/Course'
import { Dashboard, PortalLayout } from './pages/portal/Portal'
import Support from './pages/portal/Support'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="checkout/:programId" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="portal" element={<RequireAuth><PortalLayout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="course/:programId" element={<Course />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="support" element={<Support />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
