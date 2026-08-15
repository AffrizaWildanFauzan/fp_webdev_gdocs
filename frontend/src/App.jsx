import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';  

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';              
import Contact from './pages/Contact';          
import Login from './pages/Login';             
import Register from './pages/Register';        
import Wishlist from './pages/Wishlist';       
import Compare from './pages/Compare';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyProperties from './pages/dashboard/MyProperties';    
import AddProperty from './pages/dashboard/AddProperty';     
import EditProperty from './pages/dashboard/EditProperty';    
import Inquiries from './pages/dashboard/Inquiries';        
import Profile from './pages/dashboard/Profile';             

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="properties/:id" element={<PropertyDetail />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="compare" element={<Compare />} />
                </Route>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="properties" element={<MyProperties />} />
                  <Route path="properties/add" element={<AddProperty />} />
                  <Route path="properties/edit/:id" element={<EditProperty />} />
                  <Route path="inquiries" element={<Inquiries />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;