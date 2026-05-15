import React, { useEffect } from 'react';
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointment from './pages/MyAppointment';
import Appointment from './pages/Appointment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import PaymentInvoice from './pages/PaymentInvoice';
import PaymentHistory from './pages/PaymentHistory';
import AuthTest from './pages/AuthTest';
import Navbar from './components/Navbar';
import About from './pages/About';
import Footer from './components/footer';
import FloatingElements from './components/animations/FloatingElements';
import MouseFollowGlow from './components/animations/MouseFollowGlow';
import { initGSAPAnimations, cleanupGSAP } from './utils/gsapAnimations';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App=()=>{
  
  // Initialize GSAP animations on component mount
  useEffect(() => {
    initGSAPAnimations();
    
    // Cleanup on unmount
    return () => {
      cleanupGSAP();
    };
  }, []);

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      {/* Background Elements */}
      <FloatingElements />
      <MouseFollowGlow />
      
      {/* Toast Container with dark theme */}
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
      
      <Navbar/>
      <main className='relative z-10 pt-20 page-content'>
        <div className='mx-4 sm:mx-[10%]'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/doctors' element={<Doctors/>}/>
            <Route path='/doctors/:speciality' element={<Doctors/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/my-profile' element={<MyProfile/>}/>
            <Route path='/my-appointments' element={<MyAppointment/>}/>
            <Route path='/appointment/:docId' element={<Appointment/>}/>
            <Route path='/payment-success' element={<PaymentSuccess/>}/>
            <Route path='/payment-failed' element={<PaymentFailed/>}/>
            <Route path='/payment-invoice' element={<PaymentInvoice/>}/>
            <Route path='/payment-history' element={<PaymentHistory/>}/>
            <Route path='/auth-test' element={<AuthTest/>}/>
          </Routes>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
export default App;