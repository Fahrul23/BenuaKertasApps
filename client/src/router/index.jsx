import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage/LoginPage'
import HomePage from '@/pages/HomePage/HomePage'
import AdminPage from '@/pages/admin/AdminPage'
import CustomPackagingPage from '@/pages/CustomPackagingPage/CustomPackagingPage'
import CustomOrderPage from '@/pages/CustomOrderPage/CustomOrderPage'

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root ke home (bypass login) */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes - Temporarily bypassed */}
      <Route path="/home" element={<HomePage />} />
      {/* Redirect custom-packaging to custom-order */}
      <Route path="/custom-packaging" element={<Navigate to="/custom-order" replace />} />
      <Route path="/custom-order" element={<CustomOrderPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppRouter
