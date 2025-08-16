import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import App from './App.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './styles/index.css'

function Nav() {
  const linkClass = ({isActive}) => 'px-3 py-2 rounded-xl ' + (isActive ? 'bg-black text-white' : 'hover:bg-gray-200')
  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2 items-center">
        <Link to="/" className="font-bold">Pest Training</Link>
        <NavLink to="/" className={linkClass} end>Home</NavLink>
        <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        <a className="ml-auto text-sm text-gray-500" href="https://supabase.com" target="_blank" rel="noreferrer">Powered by Supabase</a>
      </div>
    </nav>
  )
}

function Router() {
  return (
    <BrowserRouter>
      <Nav/>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/admin" element={<AdminPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<Router/>)
