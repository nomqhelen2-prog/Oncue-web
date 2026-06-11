import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import IndexPage from './index'
import AboutPage from './about'
import ServicesPage from './services'
import CollaborationsPage from './collaborations'
import ContactPage from './contact'
import {SiteLayout} from '../components/SiteLayout'

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/collaborations" element={<CollaborationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </SiteLayout>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
