import './index.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './layout/NotFound';
import Login from './auth/Login'
import Register from './auth/Register'
import EventPage from './pages/EventPage';
import EventDetailPage from './pages/EventDetail';
import CreateEvent from './Origanizer/AddEvent'
import Layout from './Layout';
import CalendarView from './components/Calender';
// import { useGetCurrentUserQuery } from './features/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './features/slices/authSlice';
import { useEffect } from 'react';
import UserProfile from './UserPage/Getprofiles';
import MyEventsPage from './Origanizer/MyEvent'
import UpdateEventPage from './Origanizer/UpdateEvent';
import OriganizerDashboard from './Origanizer/Dashboard';
import BookingSummary from './pages/BookingSummary';
import SuccessPage from './Private/SuccessPage'
import ScanQR from './Booking/ScanQR';
import BookingsTable from './UserPage/Boooked';
import UserTickets from './UserPage/UserTickets';
import BookmarkedEvents from './UserPage/GetBookmarkEvents';
import ReviewsDetailPage from './Origanizer/ReviewsDetailPage';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ResetPassword from './auth/ResetPassword';
import ForgotPassword from './auth/forgotPassword';
import NotificationsPage from './pages/NotificationsPage';
import { setupSocket } from './features/middleware/socketMiddleware';
import { HelmetProvider } from "react-helmet-async";
// import SkeletonLoader from './layout/SkeletonLoader';

function App() {
  const user=useSelector((state) => state.auth.user);
  // const { data: user, isLoading } = useGetCurrentUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user)); // Update Redux state with the user data
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      setupSocket(user._id); // Ensure user joins their socket room
    }
  }, [user]);

//   if (isLoading) {
// <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {[...Array(10)].map((_, i) => (
//           <SkeletonLoader key={i} />
//         ))}
//       </div>  }

  return (
    <Router>
      <ToastContainer position="top-center" />

      <div>
        <HelmetProvider>
         <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<EventPage />} />
          {/* <Route path="/" element={<EventPage />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/useraccount" element={<UserProfile />} />
            <Route path='/bookmarked' element={<BookmarkedEvents />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />

            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/myEvent" element={<MyEventsPage />} />
          <Route path="/reviews/:eventId" element={<ReviewsDetailPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/organizer-dashboard" element={<OriganizerDashboard />} />
           <Route path="/updateEvent/:id" element={<UpdateEventPage />} />
            <Route path="/wallet" element={<UserTickets />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path='/calendar' element={<CalendarView/>}/>
            <Route path='/booked' element={<BookingsTable />} />
            <Route path='/show-not' element={<NotificationsPage />} />

            <Route path='/:id/booking-summary' element={<BookingSummary />} />
            <Route path='/:id/booking-summary' element={<BookingSummary />} />
            <Route path='/success' element={<SuccessPage />} />
            <Route path='/scanQR' element={<ScanQR />} />

          </Route>
          </Routes>
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;

