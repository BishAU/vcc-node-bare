import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Home from './pages/Home';
import Services from './pages/Services';
import Resources from './pages/Resources';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import TabNavigation from './components/TabNavigation';
import Navbar from './components/Navbar';
import Footer from './components/layout/Footer';

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" replace />;
};

// Protected route for any authenticated user
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Dashboard layout that includes the tab navigation
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TabNavigation />
      {children}
    </div>
  );
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <Navbar />
      <div className="flex-grow bg-white">
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            {/* Protected dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AdminRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </AdminRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/orders"
              element={
                <PrivateRoute>
                  <AdminRoute>
                    <DashboardLayout>
                      <Orders />
                    </DashboardLayout>
                  </AdminRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/products"
              element={
                <PrivateRoute>
                  <AdminRoute>
                    <DashboardLayout>
                      <Products />
                    </DashboardLayout>
                  </AdminRoute>
                </PrivateRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}

export default App;