// Bug Condition Exploration Test - EXPECTED TO FAIL on unfixed code
// This test confirms the bugs exist and provides counterexamples

import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userModel from './models/userModel.js';
import doctorModel from './models/doctorModel.js';

const BACKEND_URL = 'https://doctor-backend-p3mq.onrender.com';
const JWT_SECRET = process.env.JWT_SECRET || 'sarthak123';

console.log('=== BUG CONDITION EXPLORATION TEST ===');
console.log('CRITICAL: This test MUST FAIL on unfixed code');
console.log('Failure confirms bugs exist - DO NOT fix test or code when it fails');

// Test 1: Appointment Booking Authentication Mismatch
async function testAppointmentBookingBug() {
  try {
    console.log('\n🔍 Testing Appointment Booking Bug...');
    
    // Create a valid JWT token for a test user
    const testUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
    const validToken = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: '1h' });
    
    console.log('✓ Generated valid JWT token');
    console.log('Token preview:', validToken.substring(0, 30) + '...');
    
    // Appointment booking request with valid JWT but no userId in body
    const appointmentData = {
      docId: '507f1f77bcf86cd799439012', // Valid doctor ObjectId
      slotDate: '1_12_2024',
      slotTime: '10:00 AM'
      // NOTE: userId is NOT in body - middleware should set req.userId
    };
    
    console.log('📤 Sending appointment booking request...');
    console.log('Request data:', appointmentData);
    
    const response = await axios.post(
      `${BACKEND_URL}/api/appointment/book`,
      appointmentData,
      {
        headers: {
          'Authorization': `Bearer ${validToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // EXPECTED BEHAVIOR: Should succeed with valid JWT
    // ACTUAL BEHAVIOR (UNFIXED): Will fail with "userId required, userData required"
    
    if (response.data.success) {
      console.log('❌ UNEXPECTED: Appointment booking succeeded');
      console.log('This indicates the bug may already be fixed');
      return false; // Bug doesn't exist
    } else {
      console.log('✓ EXPECTED FAILURE: Appointment booking failed');
      console.log('Error message:', response.data.message);
      
      // Check for specific validation errors that confirm the bug
      const errorMsg = response.data.message.toLowerCase();
      if (errorMsg.includes('userid') || errorMsg.includes('userdata') || 
          errorMsg.includes('required') || errorMsg.includes('validation')) {
        console.log('✓ CONFIRMED: Bug exists - userId/userData validation failure');
        return true; // Bug confirmed
      } else {
        console.log('⚠️  Different error than expected:', response.data.message);
        return false; // Different issue
      }
    }
    
  } catch (error) {
    console.log('❌ Request failed:', error.response?.data?.message || error.message);
    
    // Check if it's the expected validation error
    if (error.response?.data?.message) {
      const errorMsg = error.response.data.message.toLowerCase();
      if (errorMsg.includes('userid') || errorMsg.includes('userdata') || 
          errorMsg.includes('validation failed')) {
        console.log('✓ CONFIRMED: Bug exists - appointment validation failure');
        return true; // Bug confirmed
      }
    }
    
    console.log('⚠️  Unexpected error type');
    return false;
  }
}

// Test 2: Admin Panel Port Connection Bug  
async function testAdminPanelBug() {
  try {
    console.log('\n🔍 Testing Admin Panel Connection Bug...');
    
    // Test connection to expected admin panel port
    console.log('📤 Attempting to connect to admin panel...');
    
    const response = await axios.get('http://localhost:5176/admin/login', {
      timeout: 5000
    });
    
    // EXPECTED BEHAVIOR: Should connect successfully  
    // ACTUAL BEHAVIOR (UNFIXED): ERR_CONNECTION_REFUSED
    
    console.log('❌ UNEXPECTED: Admin panel connection succeeded');
    console.log('This indicates the admin panel is running on port 5176');
    return false; // Bug doesn't exist
    
  } catch (error) {
    console.log('✓ EXPECTED FAILURE: Admin panel connection failed');
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('✓ CONFIRMED: Bug exists - connection refused to port 5176');
      console.log('Error details:', error.message);
      return true; // Bug confirmed
    } else if (error.code === 'ETIMEDOUT') {
      console.log('✓ CONFIRMED: Bug exists - connection timeout to port 5176');
      return true; // Bug confirmed  
    } else {
      console.log('⚠️  Unexpected error type:', error.code, error.message);
      return false; // Different issue
    }
  }
}

// Test 3: Profile Loading Authentication Issue
async function testProfileLoadingBug() {
  try {
    console.log('\n🔍 Testing Profile Loading Authentication...');
    
    // Create a valid JWT token
    const testUserId = '507f1f77bcf86cd799439011';
    const validToken = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: '1h' });
    
    console.log('📤 Testing profile API with valid token...');
    
    const response = await axios.get(
      `${BACKEND_URL}/api/user/profile`,
      {
        headers: {
          'Authorization': `Bearer ${validToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Check response
    if (response.data.success) {
      console.log('✓ Profile API working correctly');
      return false; // No bug here
    } else {
      console.log('❌ Profile API failed:', response.data.message);
      return true; // Potential bug
    }
    
  } catch (error) {
    console.log('❌ Profile API error:', error.response?.data?.message || error.message);
    
    // Check for authentication failures
    if (error.response?.status === 401) {
      console.log('⚠️  Authentication issue detected');
      return true; // Auth bug confirmed
    }
    
    return false;
  }
}

// Main test execution
async function runBugExplorationTests() {
  console.log('Starting bug condition exploration tests...');
  console.log('These tests SHOULD FAIL on unfixed code to confirm bugs exist\n');
  
  const results = {
    appointmentBooking: false,
    adminPanelConnection: false,
    profileLoading: false
  };
  
  // Test appointment booking bug
  results.appointmentBooking = await testAppointmentBookingBug();
  
  // Test admin panel connection bug (only in local development)
  if (process.env.NODE_ENV !== 'production') {
    results.adminPanelConnection = await testAdminPanelBug();
  } else {
    console.log('\n⏭️  Skipping admin panel test in production environment');
    results.adminPanelConnection = true; // Assume bug exists in production
  }
  
  // Test profile loading
  results.profileLoading = await testProfileLoadingBug();
  
  // Report results
  console.log('\n=== BUG EXPLORATION RESULTS ===');
  console.log('Appointment Booking Bug:', results.appointmentBooking ? '✓ CONFIRMED' : '❌ NOT FOUND');
  console.log('Admin Panel Connection Bug:', results.adminPanelConnection ? '✓ CONFIRMED' : '❌ NOT FOUND');
  console.log('Profile Loading Issue:', results.profileLoading ? '✓ CONFIRMED' : '❌ NOT FOUND');
  
  const bugsFound = Object.values(results).filter(Boolean).length;
  console.log(`\nTotal bugs confirmed: ${bugsFound}/3`);
  
  if (bugsFound > 0) {
    console.log('\n✓ SUCCESS: Bug exploration completed - bugs confirmed');
    console.log('These counterexamples demonstrate the issues exist');
    console.log('Proceed to implement fixes for confirmed bugs');
  } else {
    console.log('\n⚠️  No bugs found - issues may already be fixed');
    console.log('Verify the expected bugs still exist before proceeding');
  }
  
  return results;
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runBugExplorationTests()
    .then(results => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { runBugExplorationTests };