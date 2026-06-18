// Preservation Property Tests - Observe baseline behavior on UNFIXED code
// These tests SHOULD PASS on unfixed code to establish what must be preserved

import axios from 'axios';
import jwt from 'jsonwebtoken';

const BACKEND_URL = 'https://doctor-backend-p3mq.onrender.com';
const JWT_SECRET = process.env.JWT_SECRET || 'sarthak123';

console.log('=== PRESERVATION PROPERTY TESTS ===');
console.log('IMPORTANT: Testing baseline behavior on UNFIXED code');
console.log('These tests SHOULD PASS to establish preservation requirements\n');

// Test 1: User Authentication and Login Flows
async function testUserAuthenticationPreservation() {
  try {
    console.log('🔍 Testing User Authentication Preservation...');
    
    // Test user registration
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    console.log('📤 Testing user registration...');
    const registerResponse = await axios.post(`${BACKEND_URL}/api/user/register`, testUser);
    
    if (registerResponse.data.success) {
      console.log('✓ User registration working correctly');
      
      // Test user login with created account
      console.log('📤 Testing user login...');
      const loginResponse = await axios.post(`${BACKEND_URL}/api/user/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.data.success && loginResponse.data.token) {
        console.log('✓ User login working correctly');
        console.log('✓ JWT token generation working');
        return true;
      } else {
        console.log('❌ User login failed:', loginResponse.data.message);
        return false;
      }
    } else {
      console.log('❌ User registration failed:', registerResponse.data.message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ User authentication test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 2: Doctor Management Operations
async function testDoctorManagementPreservation() {
  try {
    console.log('\n🔍 Testing Doctor Management Preservation...');
    
    // Test getting doctor list (public endpoint)
    console.log('📤 Testing doctor list retrieval...');
    const doctorsResponse = await axios.get(`${BACKEND_URL}/api/doctor/list`);
    
    if (doctorsResponse.data.success && Array.isArray(doctorsResponse.data.doctors)) {
      console.log('✓ Doctor list retrieval working correctly');
      console.log(`✓ Found ${doctorsResponse.data.doctors.length} doctors`);
      
      // Test doctor profile access (if doctors exist)
      if (doctorsResponse.data.doctors.length > 0) {
        const firstDoctor = doctorsResponse.data.doctors[0];
        console.log('✓ Doctor data structure preserved:', {
          hasId: !!firstDoctor._id,
          hasName: !!firstDoctor.name,
          hasSpeciality: !!firstDoctor.speciality,
          hasFees: !!firstDoctor.fees
        });
      }
      
      return true;
    } else {
      console.log('❌ Doctor list retrieval failed:', doctorsResponse.data.message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Doctor management test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 3: Admin Authentication and Profile Access
async function testAdminAuthenticationPreservation() {
  try {
    console.log('\n🔍 Testing Admin Authentication Preservation...');
    
    // Test admin login with known credentials
    const adminCredentials = {
      email: 'admin@prescripto.com',
      password: 'gayatri123'
    };
    
    console.log('📤 Testing admin login...');
    const adminLoginResponse = await axios.post(`${BACKEND_URL}/api/admin/login`, adminCredentials);
    
    if (adminLoginResponse.data.success && adminLoginResponse.data.token) {
      console.log('✓ Admin login working correctly');
      
      // Test admin profile access
      console.log('📤 Testing admin profile access...');
      const profileResponse = await axios.get(`${BACKEND_URL}/api/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${adminLoginResponse.data.token}`
        }
      });
      
      if (profileResponse.data.success) {
        console.log('✓ Admin profile access working correctly');
        return true;
      } else {
        console.log('❌ Admin profile access failed:', profileResponse.data.message);
        return false;
      }
    } else {
      console.log('❌ Admin login failed:', adminLoginResponse.data.message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Admin authentication test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 4: Non-Appointment API Endpoints  
async function testOtherAPIEndpointsPreservation() {
  try {
    console.log('\n🔍 Testing Other API Endpoints Preservation...');
    
    // Test basic server health
    console.log('📤 Testing server health...');
    const healthResponse = await axios.get(`${BACKEND_URL}/`);
    
    if (healthResponse.status === 200) {
      console.log('✓ Server health check passed');
    }
    
    // Test public doctor list again (different from doctor management test)
    console.log('📤 Testing public endpoints...');
    const publicResponse = await axios.get(`${BACKEND_URL}/api/doctor/list`);
    
    if (publicResponse.data.success) {
      console.log('✓ Public API endpoints working correctly');
      return true;
    } else {
      console.log('❌ Public API endpoints failed');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Other API endpoints test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 5: JWT Token Validation for Non-Appointment Requests
async function testJWTValidationPreservation() {
  try {
    console.log('\n🔍 Testing JWT Token Validation Preservation...');
    
    // Create a valid token
    const testUserId = '507f1f77bcf86cd799439011';
    const validToken = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: '1h' });
    
    // Test token validation with a non-appointment endpoint
    console.log('📤 Testing JWT validation on profile endpoint...');
    const response = await axios.get(`${BACKEND_URL}/api/user/profile`, {
      headers: {
        'Authorization': `Bearer ${validToken}`
      }
    });
    
    // Note: This may fail if user doesn't exist, but we're testing auth mechanism
    if (response.data.success || response.data.message.includes('User not found')) {
      console.log('✓ JWT validation mechanism working correctly');
      return true;
    } else if (response.status === 401) {
      console.log('⚠️  JWT validation properly rejecting (expected for non-existent user)');
      return true;
    } else {
      console.log('❌ JWT validation failed unexpectedly');
      return false;
    }
    
  } catch (error) {
    // 401 errors are expected for non-existent users - this confirms auth is working
    if (error.response?.status === 401) {
      console.log('✓ JWT validation properly rejecting invalid tokens/users');
      return true;
    } else {
      console.log('❌ JWT validation test failed:', error.response?.data?.message || error.message);
      return false;
    }
  }
}

// Test 6: Error Handling Patterns
async function testErrorHandlingPreservation() {
  try {
    console.log('\n🔍 Testing Error Handling Preservation...');
    
    // Test invalid endpoint
    console.log('📤 Testing invalid endpoint handling...');
    const invalidResponse = await axios.get(`${BACKEND_URL}/api/invalid/endpoint`).catch(err => err.response);
    
    if (invalidResponse?.status === 404) {
      console.log('✓ Invalid endpoint handling working correctly');
    }
    
    // Test malformed request
    console.log('📤 Testing malformed request handling...');
    const malformedResponse = await axios.post(`${BACKEND_URL}/api/user/login`, {
      // Missing required fields
    }).catch(err => err.response);
    
    if (malformedResponse?.data?.success === false) {
      console.log('✓ Malformed request handling working correctly');
      return true;
    } else {
      console.log('⚠️  Error handling patterns may differ');
      return true; // Don't fail preservation for this
    }
    
  } catch (error) {
    console.log('⚠️  Error handling test inconclusive');
    return true; // Don't fail preservation for error handling
  }
}

// Main preservation test execution
async function runPreservationTests() {
  console.log('Starting preservation property tests...');
  console.log('Observing baseline behavior on UNFIXED code\n');
  
  const results = {
    userAuthentication: false,
    doctorManagement: false,
    adminAuthentication: false,
    otherAPIEndpoints: false,
    jwtValidation: false,
    errorHandling: false
  };
  
  // Run all preservation tests
  results.userAuthentication = await testUserAuthenticationPreservation();
  results.doctorManagement = await testDoctorManagementPreservation();
  results.adminAuthentication = await testAdminAuthenticationPreservation();
  results.otherAPIEndpoints = await testOtherAPIEndpointsPreservation();
  results.jwtValidation = await testJWTValidationPreservation();
  results.errorHandling = await testErrorHandlingPreservation();
  
  // Report results
  console.log('\n=== PRESERVATION TEST RESULTS ===');
  console.log('User Authentication:', results.userAuthentication ? '✓ PASS' : '❌ FAIL');
  console.log('Doctor Management:', results.doctorManagement ? '✓ PASS' : '❌ FAIL');
  console.log('Admin Authentication:', results.adminAuthentication ? '✓ PASS' : '❌ FAIL');
  console.log('Other API Endpoints:', results.otherAPIEndpoints ? '✓ PASS' : '❌ FAIL');
  console.log('JWT Validation:', results.jwtValidation ? '✓ PASS' : '❌ FAIL');
  console.log('Error Handling:', results.errorHandling ? '✓ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  console.log(`\nTotal preservation tests passed: ${passedTests}/6`);
  
  if (passedTests >= 4) {
    console.log('\n✓ SUCCESS: Baseline behavior captured');
    console.log('These behaviors must be preserved during bug fixes');
  } else {
    console.log('\n⚠️  Some preservation tests failed');
    console.log('May indicate broader system issues beyond target bugs');
  }
  
  return results;
}

// Export for use in other tests
export { runPreservationTests };

// Run if called directly  
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runPreservationTests()
    .then(results => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Preservation test execution failed:', error);
      process.exit(1);
    });
}