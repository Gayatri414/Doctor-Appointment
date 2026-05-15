import React, { useContext, useEffect } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminProtectedRoute from "./components/AdminRoute";
import DoctorRoute from "./components/DoctorRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import AdminProfile from "./pages/Admin/AdminProfile";
import DoctorLogin from "./pages/Doctor/DoctorLogin";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <>
      <Routes>
        {/* Public Login Routes */}
        <Route path="/admin/login" element={
          aToken ? <Navigate to="/admin/dashboard" replace /> : <Login />
        } />
        <Route path="/doctor/login" element={
          dToken ? <Navigate to="/doctor/dashboard" replace /> : <DoctorLogin />
        } />
        
        {/* Root redirect */}
        <Route path="/" element={
          aToken ? <Navigate to="/admin/dashboard" replace /> : 
          dToken ? <Navigate to="/doctor/dashboard" replace /> : 
          <Navigate to="/admin/login" replace />
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <Dashboard />
                </div>
              </div>
            </div>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/appointments" element={
          <AdminProtectedRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <AllAppointments />
                </div>
              </div>
            </div>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/add-doctor" element={
          <AdminProtectedRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <AddDoctor />
                </div>
              </div>
            </div>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/doctors" element={
          <AdminProtectedRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <DoctorsList />
                </div>
              </div>
            </div>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/profile" element={
          <AdminProtectedRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <AdminProfile />
                </div>
              </div>
            </div>
          </AdminProtectedRoute>
        } />

        {/* Protected Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <DoctorRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <DoctorDashboard />
                </div>
              </div>
            </div>
          </DoctorRoute>
        } />

        <Route path="/doctor/appointments" element={
          <DoctorRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <DoctorAppointments />
                </div>
              </div>
            </div>
          </DoctorRoute>
        } />

        <Route path="/doctor/profile" element={
          <DoctorRoute>
            <div className="bg-gray-900 min-h-screen text-white">
              <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
              </div>
              <Navbar />
              <div className="flex items-start relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6">
                  <DoctorProfile />
                </div>
              </div>
            </div>
          </DoctorRoute>
        } />

        {/* Catch all - redirect to admin login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          border: '1px solid #374151'
        }}
      />
    </>
  );
};

export default App;