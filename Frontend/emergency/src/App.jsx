import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

import SignupForm from './shared/SignupForm';
import LoginForm from './shared/LoginForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ForgotPasswordForm from './shared/ForgotPasswordForm';
import ResetPasswordForm from './shared/ResetPasswordForm';
import AdminDashboard from './pages/AdminDashboard';
// import Home from './pages/Home';

// Emergency Imports
import EmergencyForm from './components/emergency/EmergencyForm';
import EmergencyHomePage from './components/emergency/EmergencyHomePage';
import EmergencyList from './components/emergency/EmergencyList';
import UpdateEmergencyForm from './components/emergency/UpdateEmergencyForm';
import EmergencyDetails from './components/emergency/EmergencyDetails';

//Inventory Imports 
import InventoryForm from './components/inventory/InventoryForm';
import InventoryList from './components/inventory/InventoryList';
import UpdateInventoryForm from './components/inventory/UpdateInventoryForm';
import InventoryDetails from './components/inventory/InventoryDetails';
import InventoryHomePage from './components/inventory/InventoryHomePage';

// Vehicle Registration Imports
import About from './otherfolders/About';
import RegistrationHomePage from './components/vehicalregistation/RegistrationHomePage';
import VehicleRegistrationForm from './components/vehicalregistation/VehicleRegistrationForm';
import VehicleRegistrationList from './components/vehicalregistation/VehicleRegistrationList';
import UpdateVehicleForm from './components/vehicalregistation/UpdateVehicleForm';
import ProductDisplay from './components/inventory/ProductDisplay';

// Vehicle Error Imports
import VehicleErrorList from './components/vehicleerror/VehicleErrorList';
import VehicleErrorForm from './components/vehicleerror/VehicleErrorForm';
import VehicleErrorDetails from './components/vehicleerror/VehicleErrorDetails';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <ToastContainer />
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/aboutus" element={<About />} />
              <Route path="/" element={<Dashboard />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

              {/* Emergency Routes */}
              <Route path="/emergency" element={<ProtectedRoute><EmergencyHomePage /></ProtectedRoute>} />
              <Route path="/emergencyform" element={<ProtectedRoute><EmergencyForm /></ProtectedRoute>} />
              <Route path="/emergencylist" element={<ProtectedRoute><EmergencyList /></ProtectedRoute>} />
              <Route path="/update-emergency/:id" element={<ProtectedRoute><UpdateEmergencyForm /></ProtectedRoute>} />
              <Route path="/emergency/:id" element={<ProtectedRoute><EmergencyDetails /></ProtectedRoute>} />

              {/* Inventory Routes */}
              <Route path="/inventory" element={<ProtectedRoute><ProductDisplay /></ProtectedRoute>} />
              <Route path="/inventory-form" element={<ProtectedRoute><InventoryForm /></ProtectedRoute>} />
              <Route path="/inventory-list" element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
              <Route path="/update-inventory/:id" element={<ProtectedRoute><UpdateInventoryForm /></ProtectedRoute>} />
              <Route path="/inventory/:id" element={<ProtectedRoute><InventoryDetails /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><ProductDisplay /></ProtectedRoute>} />

              {/* Vehicle Registration Routes */}
              <Route path="/rvhome" element={<ProtectedRoute><RegistrationHomePage /></ProtectedRoute>} />
              <Route path="/registrationform" element={<ProtectedRoute><VehicleRegistrationForm /></ProtectedRoute>} />
              <Route path="/view-registrations" element={<ProtectedRoute><VehicleRegistrationList /></ProtectedRoute>} />
              <Route path="/update-vehicle-registration/:id" element={<ProtectedRoute><UpdateVehicleForm /></ProtectedRoute>} />

              {/* Vehicle Error Routes */}
              <Route path="/vehicle-errors" element={<ProtectedRoute><VehicleErrorList /></ProtectedRoute>} />
              <Route path="/vehicle-error-form" element={<ProtectedRoute><VehicleErrorForm /></ProtectedRoute>} />
              <Route path="/vehicle-error/:id" element={<ProtectedRoute><VehicleErrorDetails /></ProtectedRoute>} />

              {/* Redirect to login if no other route matches */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;