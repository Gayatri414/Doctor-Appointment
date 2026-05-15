import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const AuthTest = () => {
  const { backendUrl, token, userData, setToken, loadUserProfileData } = useContext(AppContext);
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, { test, success, message, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(backendUrl);
      addResult('Backend Connection', true, `Connected to ${backendUrl}`, response.data);
    } catch (error) {
      addResult('Backend Connection', false, `Failed to connect to ${backendUrl}: ${error.message}`);
    }
    setIsLoading(false);
  };

  const testRegistration = async () => {
    setIsLoading(true);
    try {
      const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123'
      };

      const response = await axios.post(backendUrl + '/api/user/register', testUser);
      addResult('User Registration', response.data.success, response.data.message || 'Registration successful', response.data);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        addResult('Token Storage', true, 'Token stored successfully');
      }
    } catch (error) {
      addResult('User Registration', false, error.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/login', {
        email: 'test@example.com',
        password: 'test123'
      });
      addResult('User Login', response.data.success, response.data.message || 'Login successful', response.data);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        addResult('Token Storage', true, 'Token stored successfully');
      }
    } catch (error) {
      addResult('User Login', false, error.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const testProfileLoad = async () => {
    setIsLoading(true);
    try {
      await loadUserProfileData();
      addResult('Profile Load', true, 'Profile loaded successfully', userData);
    } catch (error) {
      addResult('Profile Load', false, error.message);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    setToken(null);
    addResult('Clear Auth', true, 'Authentication cleared');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
          Authentication Debug Tool
        </h1>

        {/* Current State */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Current State</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">Backend URL:</p>
              <p className="text-green-400">{backendUrl || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400">Token:</p>
              <p className={token ? 'text-green-400' : 'text-red-400'}>
                {token ? `${token.substring(0, 20)}...` : 'No token'}
              </p>
            </div>
            <div>
              <p className="text-gray-400">User Data:</p>
              <p className={userData ? 'text-green-400' : 'text-red-400'}>
                {userData ? userData.name : 'No user data'}
              </p>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Tests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={testBackendConnection}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Test Backend
            </button>
            <button
              onClick={testRegistration}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Test Registration
            </button>
            <button
              onClick={testLogin}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={testProfileLoad}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Test Profile
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={clearResults}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
            >
              Clear Results
            </button>
            <button
              onClick={clearAuth}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Clear Auth
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          {isLoading && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Running test...</span>
            </div>
          )}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success
                    ? 'bg-green-900/20 border-green-500'
                    : 'bg-red-900/20 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{result.test}</h3>
                    <p className="text-gray-300">{result.message}</p>
                    {result.data && (
                      <pre className="text-xs text-gray-400 mt-2 overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                </div>
              </div>
            ))}
            {testResults.length === 0 && (
              <p className="text-gray-400 text-center py-8">No test results yet. Run a test to see results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;