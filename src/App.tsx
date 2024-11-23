import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import Footer from './components/Footer';

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Protected route for any authenticated user
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard layout that includes the tab navigation
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TabNavigation />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" />
        <Navbar />
        <div className="flex-grow">
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
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;