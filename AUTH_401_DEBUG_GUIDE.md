# 401 Unauthorized Debug Guide

## 🔍 **Enhanced Debugging Applied**

I've added comprehensive logging to identify exactly where the 401 error is coming from:

### **Backend Debugging Added:**
- ✅ **Auth Middleware**: Detailed token extraction and verification logs
- ✅ **Login Controller**: Token generation verification
- ✅ **Profile Controller**: User ID and database lookup logs

### **Frontend Debugging Added:**
- ✅ **Login Component**: Token storage verification
- ✅ **AppContext**: Request headers and response logging
- ✅ **Axios Headers**: Token setting verification

## 🧪 **Step-by-Step Debug Process**

### **Step 1: Restart Backend (Critical!)**
```bash
cd backend
npm start
```
**Watch for**: "Server Started 4000" message

### **Step 2: Clear Browser Storage**
```bash
F12 → Application → Storage → Clear site data
Refresh page
```

### **Step 3: Test Login with Console Open**
1. Open browser console (F12)
2. Go to `/login`
3. Enter credentials and submit
4. **Watch both frontend AND backend console logs**

### **Step 4: Analyze the Logs**

#### **Expected Frontend Logs (Success):**
```
=== FORM SUBMISSION ===
✅ Login successful!
Token received: eyJ...
💾 Storing token in localStorage...
✅ Token stored successfully: true
🔄 Setting token in context...
=== SETTING AXIOS HEADERS ===
✅ Setting axios default authorization header
Token being set: eyJ...
✅ Axios header set successfully
=== TOKEN CHANGE EFFECT ===
Valid token found, loading profile after delay...
=== LOADING USER PROFILE ===
Request config: {headers: {Authorization: "Bearer eyJ..."}}
Profile API response status: 200
✅ Profile loaded successfully: {...}
```

#### **Expected Backend Logs (Success):**
```
=== LOGIN REQUEST ===
✅ Token generated successfully
Token preview: eyJ...
JWT_SECRET used: sarthak123
✅ Login successful for user: test@example.com

=== AUTH MIDDLEWARE DEBUG ===
Authorization header: Bearer eyJ...
JWT_SECRET exists: true
🔍 Attempting to verify token...
✅ Token verified successfully
Decoded payload: {id: "...", iat: ..., exp: ...}
✅ User ID set in request: ...

=== PROFILE API HIT ===
User ID from middleware: ...
🔍 Searching for user with ID: ...
✅ User found successfully
User data: {name: "...", email: "..."}
```

## 🚨 **Common 401 Error Patterns**

### **Pattern 1: No Authorization Header**
**Backend Log:**
```
❌ No authorization header found
```
**Cause**: Frontend not sending token
**Fix**: Check if token exists in localStorage

### **Pattern 2: Invalid Token Format**
**Backend Log:**
```
❌ Authorization header doesn't start with 'Bearer '
Actual header: eyJ... (missing "Bearer ")
```
**Cause**: Token sent without "Bearer " prefix
**Fix**: Check frontend axios config

### **Pattern 3: JWT Verification Failed**
**Backend Log:**
```
❌ JWT Error: invalid signature
Error name: JsonWebTokenError
```
**Cause**: JWT_SECRET mismatch between login and verification
**Fix**: Verify JWT_SECRET in .env file

### **Pattern 4: Token Expired**
**Backend Log:**
```
❌ JWT Error: jwt expired
Error name: TokenExpiredError
```
**Cause**: Token has expired
**Fix**: Login again or increase token expiry

### **Pattern 5: User Not Found**
**Backend Log:**
```
✅ Token verified successfully
❌ User not found in database
```
**Cause**: User ID in token doesn't exist in database
**Fix**: Check database connection and user data

## 🔧 **Quick Fixes Based on Logs**

### **If Frontend Shows:**
- **"No token in response"** → Backend login not returning token
- **"Token stored successfully: false"** → localStorage issue
- **"Request config: {headers: {}}"** → Token not being added to request

### **If Backend Shows:**
- **"JWT_SECRET exists: false"** → Check backend/.env file
- **"No authorization header found"** → Frontend not sending token
- **"JWT Error: invalid signature"** → JWT_SECRET mismatch

## 🎯 **Expected Results After Fix**

1. **Login**: Only "Login successful!" toast
2. **Console**: All ✅ success logs, no ❌ error logs
3. **Navbar**: Profile menu appears within 1-2 seconds
4. **Network**: Profile API returns 200, not 401
5. **Persistence**: Refresh keeps user logged in

## 🚨 **If Still Getting 401**

### **Check These Files:**

1. **backend/.env**:
   ```
   JWT_SECRET='sarthak123'
   ```

2. **frontend/.env**:
   ```
   VITE_BACKEND_URL=http://localhost:4000
   ```

3. **localStorage** (in browser console):
   ```javascript
   localStorage.getItem('token')
   // Should return JWT token
   ```

### **Manual Token Test:**
In browser console after login:
```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token:', token);

// Test manual API call
fetch('http://localhost:4000/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(console.log);
```

The enhanced debugging will show you exactly where the authentication is failing! 🔍

## 📊 **Debug Checklist**

- [ ] Backend server running on port 4000
- [ ] JWT_SECRET set in backend/.env
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Token generated during login
- [ ] Token stored in localStorage
- [ ] Token sent in Authorization header
- [ ] Backend receives and verifies token
- [ ] User found in database
- [ ] Profile data returned successfully

Follow the logs step by step to identify the exact failure point! 🚀