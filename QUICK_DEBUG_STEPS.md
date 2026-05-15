# Quick Debug Steps - Profile Not Showing

## Step 1: Check Backend is Running ✅
```bash
cd backend
npm start
```
**Expected**: Should see "Server Started 4000" in console

## Step 2: Clear Browser Storage ✅
1. Open browser (F12)
2. Go to Application tab
3. Click "Storage" → "Clear site data"
4. Refresh page

## Step 3: Check Debug Widget ✅
- Look at bottom-right corner of your page
- You should see a small "Auth Debug" widget
- Check what it shows:
  - Backend: Should show "http://localhost:4000"
  - Token: Should show "None" initially
  - User: Should show "None" initially

## Step 4: Test Registration ✅
1. Go to login page
2. Click "Sign Up"
3. Fill form:
   - Name: Test User
   - Email: test123@example.com (use unique email)
   - Password: testpassword123 (8+ characters)
4. Submit form

## Step 5: Watch Debug Widget ✅
After clicking submit, watch the debug widget:
- Token: Should change from "None" to "eyJ..." (JWT token)
- Loading: Should briefly show "Yes"
- User: Should change to your name

## Step 6: Check Browser Console ✅
1. Open F12 → Console tab
2. Look for these logs after registration:
```
=== FORM SUBMISSION ===
Registration successful, setting token: eyJ...
=== TOKEN CHANGE EFFECT ===
Token: eyJ...
CALLING PROFILE API...
=== LOADING USER PROFILE ===
Profile API response: {success: true, user: {...}}
```

## What to Look For ❓

### If Debug Widget Shows:
- **Backend: "Not set"** → Check `frontend/.env` file
- **Token: "None" after registration** → Backend issue or network error
- **Token: "eyJ..." but User: "None"** → Profile API failing
- **Loading: "Yes" forever** → Profile API hanging

### Common Issues:

1. **Backend Not Running**
   - Debug widget shows "Backend: Not set"
   - Console shows network errors

2. **Wrong Backend URL**
   - Check `frontend/.env` has: `VITE_BACKEND_URL=http://localhost:4000`
   - Restart frontend after changing

3. **Registration Failing**
   - Console shows error messages
   - Check backend console for errors

4. **Profile API Failing**
   - Token exists but no user data
   - Check backend console for profile API errors

## Quick Fixes 🔧

### Fix 1: Restart Everything
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Fix 2: Check Environment Files
**frontend/.env**:
```
VITE_BACKEND_URL=http://localhost:4000
```

**backend/.env** should have:
```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
```

### Fix 3: Test with Debug Tool
- Go to `http://localhost:5173/auth-test`
- Click "Test Backend" - should show success
- Click "Test Registration" - should create account
- Click "Test Profile" - should load profile

## Report Back 📝
Tell me what you see in:
1. Debug widget values
2. Browser console logs
3. Any error messages

This will help me identify the exact issue! 🔍