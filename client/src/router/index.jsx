import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'

// Import pages tambahan di sini setelah dibuat
// import DashboardPage from '@/pages/DashboardPage'
// import AdminDashboard from '@/pages/admin/AdminDashboard'

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root ke login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes (uncomment setelah buat halaman) */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
