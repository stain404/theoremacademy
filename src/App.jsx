import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import SiteLayout from './components/Layout'
import { AuthProvider, RequireAuth } from './lib/auth'
import { Login, Register } from './pages/Auth'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Mentors from './pages/Mentors'
import NotFound from './pages/NotFound'
import { ProgramDetail, Programs } from './pages/Programs'
import Certificates from './pages/portal/Certificates'
import Course from './pages/portal/Course'
import { Dashboard, PortalLayout } from './pages/portal/Portal'
import Support from './pages/portal/Support'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView())
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
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:programId" element={<ProgramDetail />} />
            <Route path="about" element={<About />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="checkout/:programId" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="portal" element={<RequireAuth><PortalLayout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="course/:programId" element={<Course />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="support" element={<Support />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
