import React from 'react';

const ClearTokens = () => {
  const clearAllData = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear specific tokens
    localStorage.removeItem('token');
    localStorage.removeItem('aToken');
    localStorage.removeItem('dToken');
    
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    alert('All tokens and data cleared! Please refresh the page.');
    
    // Force reload
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      background: 'red',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer'
    }} onClick={clearAllData}>
      Clear All Tokens
    </div>
  );
};

export default ClearTokens;