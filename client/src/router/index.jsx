import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage/LoginPage'
import HomePage from '@/pages/HomePage/HomePage'
import AdminPage from '@/pages/admin/AdminPage'

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root ke login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
