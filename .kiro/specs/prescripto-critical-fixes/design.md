# Prescripto Critical Fixes Bugfix Design

## Overview

This design addresses two critical bugs in the Prescripto MERN stack application that prevent core functionality: appointment booking failures due to missing user data validation, and admin panel inaccessibility due to port misconfiguration. The appointment booking bug occurs because the backend expects userId and userData but the authentication middleware sets req.userId while the controller expects direct userId in request body. The admin panel bug stems from Vite server running on port 5174 instead of expected port 5176. The fix approach involves modifying the appointment controller to properly extract user information from JWT authentication and correcting the admin panel port configuration.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the appointment booking validation failure - when userId and userData are missing from appointment creation despite valid JWT authentication
- **Property (P)**: The desired behavior when appointment booking is attempted - successful creation with proper user data extraction and validation
- **Preservation**: Existing authentication flows, doctor management, and non-appointment functionality that must remain unchanged by the fix
- **bookAppointment**: The function in `backend/controllers/appointmentController.js` that handles appointment creation but fails to extract userId from req.userId set by authUser middleware
- **authUser**: The middleware in `backend/middlewares/authUser.js` that validates JWT tokens and sets req.userId but doesn't provide userData
- **appointmentModel**: The Mongoose model requiring userId and userData fields for appointment validation
- **Admin Panel Port**: The Vite development server configuration expecting port 5176 but currently running on 5174

## Bug Details

### Bug Condition

The bugs manifest when users attempt to book appointments through authenticated requests and when accessing the admin panel. The `bookAppointment` controller expects userId from request body but the `authUser` middleware sets it as `req.userId`, creating a mismatch. Additionally, userData must be fetched from the database using the authenticated userId. The admin panel fails to connect because Vite server runs on port 5174 while the system expects port 5176.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { requestType: 'appointment' | 'admin_access', requestData: Object }
  OUTPUT: boolean
  
  IF input.requestType == 'appointment' THEN
    RETURN input.requestData.hasValidJWT == true
           AND input.requestData.userIdInBody == undefined
           AND input.requestData.userDataInBody == undefined
           AND input.requestData.expectedValidation == true
  
  IF input.requestType == 'admin_access' THEN  
    RETURN input.requestData.expectedPort == 5176
           AND input.requestData.actualPort == 5174
           AND input.requestData.connectionAttempt == true
  
  RETURN false
END FUNCTION
```

### Examples

- **Appointment Booking**: User with valid JWT token calls `/api/appointment/book` with {docId: "123", slotDate: "1_12_2024", slotTime: "10:00 AM"} → Expected: successful booking, Actual: validation error "userId required, userData required"
- **User Data Missing**: Controller receives req.userId = "user123" from middleware but expects {userId: "user123"} in req.body → Expected: use req.userId, Actual: undefined userId causes validation failure  
- **Admin Panel Access**: Navigate to localhost:5176/admin/login → Expected: admin login page, Actual: ERR_CONNECTION_REFUSED because server runs on port 5174
- **Port Mismatch**: Vite config specifies port 5174 but system expects 5176 → Expected: admin panel accessible, Actual: connection refused

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Mouse clicks on action buttons and UI interactions must continue to work exactly as before
- JWT token validation and authentication flows for all other endpoints must remain unchanged
- Doctor data management and availability slot calculations must remain unchanged
- Existing API endpoints for user login, doctor browsing, and profile management must continue functioning
- Database operations for non-appointment models (user, doctor, admin) must remain unchanged
- Frontend routing and navigation for patient interface must remain unchanged

**Scope:**
All inputs that do NOT involve appointment booking API calls or admin panel access should be completely unaffected by this fix. This includes:
- User authentication and login flows
- Doctor profile viewing and search functionality  
- Patient profile management
- Other API endpoints (doctor routes, user routes, admin routes)
- Frontend application serving on port 5177
- Backend API server on port 4000

## Hypothesized Root Cause

Based on the bug analysis and code examination, the most likely issues are:

1. **Middleware-Controller Data Flow Mismatch**: The `authUser` middleware correctly extracts userId from JWT and sets `req.userId`, but the `bookAppointment` controller expects `userId` from `req.body` instead of using the authenticated `req.userId`

2. **Missing User Data Fetching**: The controller expects `userData` in the appointment creation object but never fetches user data from the database using the authenticated userId

3. **Port Configuration Error**: The Vite configuration in `admin/vite.config.js` specifies `port: 5174` instead of the expected `port: 5176`

4. **Authentication Flow Disconnect**: The frontend correctly sends JWT tokens, middleware validates them and sets req.userId, but the controller doesn't utilize this authenticated user information properly

## Correctness Properties

Property 1: Bug Condition - Appointment Booking with Authenticated User Data

_For any_ appointment booking request where a valid JWT token is provided and appointment data (docId, slotDate, slotTime) is included, the fixed bookAppointment function SHALL successfully extract userId from req.userId (set by authUser middleware), fetch corresponding userData from the database, and create the appointment with complete validation.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Non-Appointment API Behavior  

_For any_ API request that is NOT an appointment booking request (user login, doctor browsing, profile management, admin operations), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing authentication flows and database operations.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

## Fix Implementation

### Changes Required

**File**: `backend/controllers/appointmentController.js`

**Function**: `bookAppointment`

**Specific Changes**:
1. **Remove userId from req.body destructuring**: Change `const { userId, docId, slotDate, slotTime } = req.body;` to `const { docId, slotDate, slotTime } = req.body;`

2. **Extract userId from req.userId**: Add `const userId = req.userId;` after the destructuring to get the authenticated user ID from middleware

3. **Add userId validation**: Add validation to ensure userId exists from authentication: 
   ```javascript
   if (!userId) {
     return res.json({ success: false, message: "Authentication required" });
   }
   ```

4. **Maintain userData fetching**: Keep existing `userData` fetching from database using the extracted userId

5. **Add error handling**: Add try-catch around user data fetching to handle cases where user doesn't exist

**File**: `admin/vite.config.js`

**Specific Changes**:
1. **Update port configuration**: Change `server:{port:5174}` to `server:{port:5176}` to match expected admin panel port

2. **Add host configuration**: Add `host: true` to allow external connections if needed for admin panel access

### Additional Considerations

**Frontend bookAppointment function** in `frontend/src/pages/Appointment.jsx` is correctly implemented - it sends JWT token in Authorization header and includes docId, slotDate, slotTime in request body. No changes needed.

**authUser middleware** in `backend/middlewares/authUser.js` is correctly implemented - it validates JWT tokens and sets req.userId. No changes needed.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate authenticated appointment booking requests and admin panel connection attempts. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Appointment Booking with Valid JWT**: Send POST to `/api/appointment/book` with valid JWT token and appointment data (will fail on unfixed code with "userId required" error)
2. **User Data Validation**: Test that userData is properly fetched from database using authenticated userId (will fail on unfixed code)
3. **Admin Panel Connection**: Attempt to connect to localhost:5176 when server runs on 5174 (will fail with connection refused)
4. **Port Configuration**: Verify Vite server starts on expected port 5176 (will fail on unfixed code running on 5174)

**Expected Counterexamples**:
- Appointment validation errors: "Path 'userId' is required, Path 'userData' is required"
- Admin panel connection failures: ERR_CONNECTION_REFUSED at localhost:5176
- Possible causes: middleware-controller data mismatch, incorrect port configuration, missing user data fetching

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  IF input.requestType == 'appointment' THEN
    result := bookAppointment_fixed(input)
    ASSERT result.success == true AND result.appointmentCreated == true
  IF input.requestType == 'admin_access' THEN
    result := connectToAdminPanel_fixed(input)  
    ASSERT result.connection == 'successful' AND result.port == 5176
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalFunction(input) = fixedFunction(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss  
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for non-appointment API calls and other admin functionality, then write property-based tests capturing that behavior.

**Test Cases**:
1. **User Authentication Preservation**: Verify login/logout flows continue to work exactly as before
2. **Doctor Management Preservation**: Verify doctor CRUD operations remain unchanged
3. **Other API Endpoints Preservation**: Verify user profile, doctor profile, and admin dashboard APIs continue working
4. **Frontend Navigation Preservation**: Verify patient interface routing and interactions remain unchanged

### Unit Tests

- Test appointment booking with valid JWT tokens and complete appointment data
- Test error handling for missing authentication or invalid tokens
- Test user data fetching from database using authenticated userId
- Test admin panel server starts on correct port 5176
- Test that non-appointment endpoints continue to work correctly

### Property-Based Tests

- Generate random valid JWT tokens and appointment data to verify booking succeeds
- Generate random user authentication scenarios to verify preservation of auth flows  
- Generate random API requests to non-appointment endpoints to verify unchanged behavior
- Test that port configuration changes don't affect other server functionality

### Integration Tests

- Test full appointment booking flow: user login → doctor selection → slot booking → confirmation
- Test admin panel access: navigate to localhost:5176 → login → dashboard access
- Test that fixing appointment booking doesn't break other patient or doctor workflows
- Test that admin panel port fix doesn't affect frontend or backend operations