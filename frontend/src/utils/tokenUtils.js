// Token utility functions

export const clearAllTokens = () => {
  localStorage.removeItem('token');      // User token
  localStorage.removeItem('aToken');     // Admin token  
  localStorage.removeItem('dToken');     // Doctor token
  
  // Clear axios default headers
  delete window.axios?.defaults?.headers?.common?.Authorization;
  
  console.log('All tokens cleared');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    return null;
  }
};