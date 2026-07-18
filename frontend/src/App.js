import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceGuideProvider } from './context/VoiceGuideContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import VoiceGuideToggle from './components/VoiceGuideToggle';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminLogs from './pages/admin/AdminLogs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import AdminReports from './pages/admin/AdminReports';
import StoreOrders from './pages/StoreOrders';
import TraderLayout from './pages/trader/TraderLayout';
import TraderDashboard from './pages/trader/TraderDashboard';
import TraderProducts from './pages/trader/TraderProducts';
import TraderProfile from './pages/trader/TraderProfile';
import Analytics from './pages/Analytics';
import ManagerLayout from './pages/manager/ManagerLayout';
import ManagerTraders from './pages/manager/ManagerTraders';
import ManagerProfile from './pages/manager/ManagerProfile';

function App() {
  return (
    <LanguageProvider>
      <VoiceGuideProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Routes>
                  <Route element={<><Navbar /><main className="flex-1 bg-gray-50"><Outlet /></main><Footer /><Chatbot /><VoiceGuideToggle /></>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                  </Route>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="logs" element={<AdminLogs />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="orders" element={<StoreOrders />} />
                  </Route>
                  <Route path="/trader" element={<TraderLayout />}>
                    <Route index element={<TraderDashboard />} />
                    <Route path="products" element={<TraderProducts />} />
                    <Route path="orders" element={<StoreOrders />} />
                    <Route path="profile" element={<TraderProfile />} />
                  </Route>
                  <Route path="/manager" element={<ManagerLayout />}>
                    <Route index element={<Analytics />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<StoreOrders />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="traders" element={<ManagerTraders />} />
                    <Route path="profile" element={<ManagerProfile />} />
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </VoiceGuideProvider>
    </LanguageProvider>
  );
}

export default App;
