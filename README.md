# Event Booking Management System (EBMS)

A comprehensive full-stack web application for event management, booking, and administration. This system provides a complete solution for event organizers, attendees, vendors, and administrators.

## 🚀 Project Overview

EBMS is a modern, scalable event management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables users to create, discover, book, and manage events seamlessly.

### Key Features

- **Multi-User /Actor/ System**: Support for regular users, event organizers, vendors, and administrators
- **Event Management**: Create, update, and manage events with rich details
- **Booking System**: Secure ticket booking with payment integration
- **Real-time Communication**: Live chat and notifications using Socket.io
- **QR Code Integration**: Ticket verification and scanning
- **Calendar Integration**: Google Calendar sync for events
- **Payment Processing**: Secure payment gateway integration
- **Admin Dashboard**: Comprehensive admin panel for system management
- **Responsive Design**: Mobile-first approach with modern UI/UX

## 📁 Project Structure

```
EBMS/
├── back/                    # Backend API (Node.js/Express)
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── front/ebms/            # Frontend Application (React)
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices and API
│   │   ├── store/         # Redux store
│   │   └── assets/        # Images and static assets
│   └── package.json
├── admin-panel/admin/     # Admin Panel (React + Vite)
│   ├── src/               # Source code
│   │   ├── components/    # Admin components
│   │   ├── pages/         # Admin pages
│   │   └── routes/        # Admin routes
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage
- **Nodemailer** - Email services
- **QRCode** - QR code generation
- **Google APIs** - Calendar integration

### Frontend (Main App)
- **React.js** - Frontend framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Ant Design** - UI components
- **Socket.io Client** - Real-time features
- **React Hook Form** - Form handling
- **Chart.js** - Data visualization
- **Leaflet** - Maps integration
- **Framer Motion** - Animations

### Admin Panel
- **React.js** - Frontend framework
- **Vite** - Build tool
- **Material-UI** - UI components
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Chart.js** - Analytics visualization

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MelakuAzene21/Event-Management-Systems
   cd EBMS
   ```

2. **Install Backend Dependencies**
   ```bash
   cd back
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../front/ebms
   npm install
   ```

4. **Install Admin Panel Dependencies**
   ```bash
   cd ../../admin-panel/admin
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables** (Create `.env` in `back/` directory)
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   NODE_ENV=development
   ```

2. **Frontend Environment Variables** (Create `.env` in `front/ebms/` directory)
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

3. **Admin Panel Environment Variables** (Create `.env` in `admin-panel/admin/` directory)
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd back
   npm start
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend Application**
   ```bash
   cd front/ebms
   npm start
   ```
   Frontend will run on `http://localhost:3000`

3. **Start Admin Panel**
   ```bash
   cd admin-panel/admin
   npm run dev
   ```
   Admin panel will run on `http://localhost:5173`

## 📋 Features Breakdown

### User Features
- **Authentication**: Register, login, password reset
- **Event Discovery**: Browse events by category, location, date
- **Event Booking**: Book tickets with secure payment
- **QR Code Tickets**: Digital tickets with QR codes
- **User Profile**: Manage personal information and preferences
- **Bookmarks**: Save favorite events
- **Reviews & Ratings**: Rate and review attended events
- **Notifications**: Real-time notifications
- **Chat System**: Communicate with organizers and vendors

### Organizer Features
- **Event Creation**: Create and manage events
- **Dashboard**: Analytics and event management
- **Ticket Management**: Track bookings and sales
- **QR Code Scanner**: Verify tickets at events
- **Calendar Integration**: Sync with Google Calendar
- **Vendor Management**: Connect with service providers

### Vendor Features
- **Vendor Dashboard**: Manage services and bookings
- **Service Listings**: Showcase services to organizers
- **Communication**: Chat with organizers
- **Profile Management**: Update business information

### Admin Features
- **User Management**: Manage all users and roles
- **Event Approval**: Review and approve events
- **Analytics Dashboard**: System-wide analytics
- **Category Management**: Manage event categories
- **Revenue Reports**: Financial analytics
- **System Monitoring**: Monitor platform health

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details

### Payments
- `POST /api/payment/process` - Process payment
- `GET /api/payment/history` - Payment history

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:eventId` - Get event reviews

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id` - Mark notification as read

### Chat
- `GET /api/chats` - Get user chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id/messages` - Get chat messages

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Cross-origin resource sharing configuration
- **Input Validation**: Request validation and sanitization
- **File Upload Security**: Secure file upload with validation
- **Rate Limiting**: API rate limiting for abuse prevention

## 📱 Real-time Features

- **Live Chat**: Real-time messaging between users
- **Notifications**: Instant notifications for events and updates
- **Online Status**: User online/offline status tracking
- **Live Updates**: Real-time event updates and booking status

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Clean and intuitive user interface
- **Dark/Light Mode**: Theme customization
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliance features

## 📊 Analytics & Reporting

- **Event Analytics**: Event performance metrics
- **Revenue Reports**: Financial reporting and analytics
- **User Analytics**: User behavior and engagement metrics
- **Booking Analytics**: Booking patterns and trends

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

### Admin Panel Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Melaku Azene** - Event Booking Management System

## 📞 Support
DM in Telegram   @Melaku_21

For support and questions, please contact the development team or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added real-time chat and notifications
- **v1.2.0** - Enhanced admin panel and analytics
- **v1.3.0** - Added vendor management system

---

**Note**: Make sure to update the environment variables and configuration according to your deployment environment.
