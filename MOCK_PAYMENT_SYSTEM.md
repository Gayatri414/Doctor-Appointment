# Mock Payment Gateway System

A complete fake/mock payment gateway system for demo and testing purposes without using real payment services or transactions.

## 🎯 Features

### ✅ **Complete Payment Flow**
- **Payment Page** with order summary, amount display, and payment methods
- **Loading States** during payment processing (2-second simulation)
- **Success/Failure Simulation** (90% success rate, 10% failure rate)
- **Payment Success Page** with transaction details and animations
- **Payment Failed Page** with retry options and error handling
- **Invoice Generation** with downloadable/printable receipts
- **Payment History** with transaction tracking and filtering

### ✅ **Backend Implementation**
- **Mock Payment Controller** with proper error handling
- **Payment Model** for storing fake transaction data in MongoDB
- **RESTful API Routes** for all payment operations
- **Admin Payment Management** with statistics and oversight
- **Async/Await** implementation throughout

### ✅ **Frontend Implementation**
- **Modern Responsive UI** with Tailwind CSS
- **Toast Notifications** for user feedback
- **Loading Spinners** and disabled states during processing
- **Payment Method Selection** (Credit Card, UPI, Wallet, Net Banking)
- **Success Animations** and failure handling
- **Invoice Download** functionality

## 🏗️ Architecture

### **Database Schema**
```javascript
{
  userId: String (required),
  appointmentId: String (required),
  orderId: String (required, unique),
  paymentId: String (required, unique),
  amount: Number (required),
  currency: String (default: 'USD'),
  status: Enum ['pending', 'success', 'failed', 'refunded'],
  paymentMethod: String (default: 'mock_payment'),
  transactionDate: Date,
  failureReason: String,
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **API Endpoints**

#### **User Endpoints**
- `POST /api/mock-payment/create-order` - Create payment order
- `POST /api/mock-payment/process-payment` - Process payment
- `GET /api/mock-payment/history` - Get payment history
- `GET /api/mock-payment/details/:paymentId` - Get payment details
- `POST /api/mock-payment/retry` - Retry failed payment

#### **Admin Endpoints**
- `GET /api/mock-payment/admin/all-payments` - Get all payments

## 🚀 How It Works

### **1. Payment Initiation**
```javascript
// User clicks "Pay Now" button
const initiatePayment = (appointment) => {
  setSelectedAppointment(appointment);
  setShowPayment(true);
};
```

### **2. Payment Processing**
```javascript
// 2-second delay simulation
const simulatePaymentDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 2000));
};

// 90% success, 10% failure
const simulatePaymentResult = () => {
  const random = Math.random();
  return {
    success: random <= 0.9,
    failureReason: random > 0.9 ? getRandomFailureReason() : null
  };
};
```

### **3. Payment Success Flow**
1. Generate fake payment ID and order ID
2. Update payment record in database
3. Update appointment status to 'confirmed'
4. Show success animation
5. Redirect to success page with payment details
6. Option to download invoice

### **4. Payment Failure Flow**
1. Update payment record with failure reason
2. Show failure animation
3. Redirect to failure page
4. Provide retry option
5. Display common failure reasons

## 💳 Payment Methods Supported

- **Credit/Debit Card** (with demo card details)
- **UPI Payment** (mock UPI interface)
- **Digital Wallet** (simulated wallet payment)
- **Net Banking** (mock banking interface)

## 📱 User Interface

### **Payment Modal**
- Order summary with doctor details
- Payment method selection
- Demo card input fields (read-only)
- Security notices
- Processing animations

### **Success Page**
- Animated success checkmark
- Payment details display
- Action buttons (View Appointments, Download Invoice)
- Confirmation message

### **Failed Page**
- Error animation
- Failure reason display
- Common failure reasons list
- Retry and support options

### **Invoice Page**
- Professional invoice layout
- Complete transaction details
- Printable format
- Company branding

### **Payment History**
- Filterable transaction list
- Status badges and indicators
- Payment statistics cards
- Invoice access for successful payments

## 🔧 Configuration

### **Success/Failure Rates**
```javascript
// Modify in mockPaymentController.js
const simulatePaymentResult = () => {
  const random = Math.random();
  return {
    success: random <= 0.9, // 90% success rate
    failureReason: random > 0.9 ? getRandomFailureReason() : null
  };
};
```

### **Processing Delay**
```javascript
// Modify delay time in mockPaymentController.js
const simulatePaymentDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds
};
```

### **Failure Reasons**
```javascript
const getRandomFailureReason = () => {
  const reasons = [
    'Insufficient funds',
    'Card declined',
    'Network timeout',
    'Invalid card details',
    'Transaction limit exceeded'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};
```

## 🎨 UI Components

### **MockPayment Component**
- Complete payment modal with all payment methods
- Real-time processing states
- Error handling and retry logic

### **PaymentSuccess Component**
- Success animations and confirmations
- Payment details display
- Navigation to other pages

### **PaymentFailed Component**
- Error display and retry options
- Support contact information
- Common failure reasons

### **PaymentInvoice Component**
- Professional invoice layout
- Print functionality
- Complete transaction details

### **PaymentHistory Component**
- Transaction list with filtering
- Statistics dashboard
- Status indicators

## 🔒 Security Features

- **No Real Payment Processing** - Completely simulated
- **Secure Data Storage** - All fake data stored securely
- **User Authentication** - JWT-based access control
- **Input Validation** - Server-side validation for all inputs
- **Error Handling** - Comprehensive error management

## 📊 Admin Features

### **Payment Statistics**
- Total payments count
- Success/failure rates
- Revenue tracking
- Payment method analytics

### **Payment Management**
- View all transactions
- Filter by status/date
- User and appointment details
- Payment oversight

## 🔄 Integration with Existing System

### **Appointment Integration**
- Seamless integration with appointment booking
- Automatic status updates
- Doctor slot management
- User notification system

### **Database Integration**
- MongoDB storage for all payment data
- Relationship with appointments and users
- Transaction history tracking
- Data consistency maintenance

## 🚀 Getting Started

### **1. Backend Setup**
```bash
# Payment model and controller are already created
# Routes are integrated in server.js
# No additional setup required
```

### **2. Frontend Setup**
```bash
# All payment components are created
# Routes are added to App.jsx
# No additional dependencies required
```

### **3. Testing the System**
1. Book an appointment
2. Click "Pay Now" button
3. Select payment method
4. Click "Pay $XX" button
5. Wait for 2-second processing
6. Experience success (90%) or failure (10%)
7. Navigate through success/failure flows

## 🎯 Demo Scenarios

### **Successful Payment**
1. User books appointment
2. Initiates payment
3. Selects payment method
4. Payment processes successfully
5. Redirected to success page
6. Can download invoice
7. Payment appears in history

### **Failed Payment**
1. User books appointment
2. Initiates payment
3. Payment fails (10% chance)
4. Redirected to failure page
5. Can retry payment
6. Failed payment logged in history

## 🔧 Customization

### **Modify Success Rate**
Edit `simulatePaymentResult()` in `mockPaymentController.js`

### **Change Processing Time**
Edit `simulatePaymentDelay()` in `mockPaymentController.js`

### **Add Payment Methods**
Edit `paymentMethods` array in `MockPayment.jsx`

### **Customize Failure Reasons**
Edit `getRandomFailureReason()` in `mockPaymentController.js`

## 📈 Analytics & Reporting

### **Payment Metrics**
- Total transaction volume
- Success/failure rates
- Average transaction amount
- Payment method preferences

### **User Behavior**
- Payment completion rates
- Retry attempt patterns
- Time to payment completion
- Abandonment points

## 🔄 Migration to Real Payment Gateway

When ready to integrate with a real payment gateway (like Razorpay, Stripe, etc.):

1. **Replace Mock Controller** with real payment gateway API calls
2. **Update Payment Model** to match real gateway response format
3. **Modify Frontend Components** to use real payment gateway SDK
4. **Update Environment Variables** with real API keys
5. **Add Webhook Handlers** for real payment confirmations
6. **Implement Real Security** measures and compliance

## 🎉 Benefits

- **Complete Testing Environment** without real money
- **Realistic User Experience** with actual payment flows
- **Development Friendly** with predictable outcomes
- **Demo Ready** for presentations and showcases
- **Easy Migration** to real payment systems
- **Cost Effective** for development and testing
- **Risk Free** with no real financial transactions

---

**Note**: This is a complete mock system for demonstration and testing purposes only. No real payments are processed, and no real payment gateway APIs are used.