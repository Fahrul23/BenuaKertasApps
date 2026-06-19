import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage/LoginPage'
import HomePage from '@/pages/HomePage/HomePage'
import AdminPage from '@/pages/admin/AdminPage'
import CustomPackagingPage from '@/pages/CustomPackagingPage/CustomPackagingPage'
import CustomOrderPage from '@/pages/CustomOrderPage/CustomOrderPage'
import PaymentPage from '@/pages/PaymentPage/PaymentPage'
import ProfilePage from '@/pages/ProfilePage/ProfilePage'
import OrderManagementPage from '@/pages/admin/OrderManagementPage/OrderManagementPage'
import BoxModelManagementPage from '@/pages/admin/BoxModelManagementPage/BoxModelManagementPage'
import MaterialManagementPage from '@/pages/admin/MaterialManagementPage/MaterialManagementPage'
import FinishingOptionManagementPage from '@/pages/admin/FinishingOptionManagementPage'

import BankAccountManagementPage from '@/pages/admin/BankAccountManagementPage'
import PricingConfigManagementPage from '@/pages/admin/PricingConfigManagementPage'
import CmykBlokPriceManagementPage from '@/pages/admin/CmykBlokPriceManagementPage'
import PlanoTypeManagementPage from '@/pages/admin/PlanoTypeManagementPage/PlanoTypeManagementPage'
import MaterialPriceManagementPage from '@/pages/admin/MaterialPriceManagementPage/MaterialPriceManagementPage'
import { AdminLayout } from '@/components'

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
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Admin Routes — nested under AdminLayout (custom navbar + sidebar) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="box-models" element={<BoxModelManagementPage />} />
        <Route path="materials" element={<MaterialManagementPage />} />
        <Route path="finishing-options" element={<FinishingOptionManagementPage />} />
        <Route path="plano-types" element={<PlanoTypeManagementPage />} />
        <Route path="material-prices" element={<MaterialPriceManagementPage />} />

        <Route path="bank-accounts" element={<BankAccountManagementPage />} />
        <Route path="cmyk-blok-prices" element={<CmykBlokPriceManagementPage />} />
        <Route path="pricing-config" element={<PricingConfigManagementPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppRouter

