import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import IndexPage from './index'
import AboutPage from './about'
import ServicesPage from './services'
import CollaborationsPage from './collaborations'
import ContactPage from './contact'
import StaffInvoicePage from './staff-invoice'
import AdminLogin from './admin/login'
import AdminDashboard from './admin/dashboard'
import PrivacyPage from './privacy'
import TermsPage from './terms'
import {SiteLayout} from '../components/SiteLayout'

function App() {
  return (
    <Routes>
      {/* Staff tool — no nav/footer */}
      <Route path="/staff/invoice" element={<StaffInvoicePage />} />

      {/* Admin — no nav/footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Public site */}
      <Route path="/*" element={
        <SiteLayout>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/collaborations" element={<CollaborationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </SiteLayout>
      } />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
