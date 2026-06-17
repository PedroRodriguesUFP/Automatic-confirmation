import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Conversations from './pages/Conversations'
import Settings from './pages/Settings'
import BookingPage from './pages/BookingPage'
import Layout from './components/ui/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública de marcação — sem layout de dashboard */}
        <Route path="/b/:slug" element={<BookingPage />} />

        {/* Dashboard do negócio */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
