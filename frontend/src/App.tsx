import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Background from './components/Background'
import Header from './components/Header'
import Hero from './components/Hero'
import Categories from './components/Categories'
import SkilledProfessionals from './components/SkilledProfessionals'
import QualityMaterial from './components/QualityMaterial'
import BuildYourDream from './components/BuildYourDream'
import HowItWorks from './components/HowItWorks'
import GrowYourBusiness from './components/GrowYourBusiness'
import ProfessionalRegistration from './components/ProfessionalRegistration'
import ServiceAreas from './components/ServiceAreas'
import DownloadApp from './components/DownloadApp'
import OurMission from './components/OurMission'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from './components/Signup'
import BusinessTypeSelection from './pages/BusinessTypeSelection'
import BusinessRegistration from './pages/BusinessRegistration'
import BusinessSuccess from './pages/BusinessSuccess'
import AdminBusinessApprovals from './pages/AdminBusinessApprovals'
import AdminCustomers from './pages/AdminCustomers'
import VendorDashboard from './pages/VendorDashboard'
import VendorLayout from './layouts/VendorLayout'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import ProductManagement from './pages/ProductManagement'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import ProductApprovals from './pages/ProductApprovals'
import ProtectedRoute from './components/ProtectedRoute'
import PublicProducts from './pages/PublicProducts'
import WorkerRegistration from './pages/WorkerRegistration'
import WorkerList from './pages/WorkerList'
import PropertyList from './pages/PropertyList'
import SellProperty from './pages/SellProperty'
import CartPage from './pages/CartPage'

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <SkilledProfessionals />
      <QualityMaterial />
      <BuildYourDream />
      <HowItWorks />
      <GrowYourBusiness />
      <ProfessionalRegistration />
      <ServiceAreas />
      <DownloadApp />
      <OurMission />
    </>
  )
}

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/super-admin') || location.pathname.startsWith('/vendor');

  return (
    <>
      <Background />
      {!isDashboard && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<PublicProducts />} />
        <Route path="/work/register" element={<WorkerRegistration />} />
        <Route path="/workers" element={<WorkerList />} />
        <Route path="/properties-list" element={<PropertyList />} />
        <Route path="/sell-property" element={<SellProperty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/business/type-selection" element={<BusinessTypeSelection />} />
        <Route path="/business/register" element={<BusinessRegistration />} />
        <Route path="/business/success" element={<BusinessSuccess />} />
        <Route path="/admin/business-approvals" element={<AdminBusinessApprovals />} />

        {/* Vendor Routes */}
        <Route path="/vendor" element={
          <ProtectedRoute requiredRole="admin">
            <VendorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<ProductManagement />} />
        </Route>
        {/* Super Admin Routes */}
        <Route path="/super-admin" element={
          <ProtectedRoute requiredRole="superadmin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="business-approvals" element={<AdminBusinessApprovals />} />
          <Route path="product-approvals" element={<ProductApprovals />} />
        </Route>
      </Routes>
      {!isDashboard && <Footer />}
    </>
  )
}

import ScrollToTop from './components/ScrollToTop'



function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  )
}

export default App
