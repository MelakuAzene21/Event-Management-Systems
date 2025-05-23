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
import { useGetCurrentUserQuery } from './features/api/authApi';
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
import GetAllVendor from './Vendorpage/GetAllvendor';
import SkeletonLoader from './layout/SkeletonLoader';
import OrganizerDetails from './Origanizer/OrganizerDetails';
import CategoryEvents from './layout/CategoryEvents';
import CityEvents from './UserPage/CityByEvents';
import MyEvents from './components/MyEvents';
import VendorDetail  from './Vendorpage/VendorDetail';
import Body from './components/Body';
import Vendordashboard from './Vendor/Vendordashboard';
import ChatInterface from './components/ChatInterface';
import VendorProfile  from './components/VendorProfile';
import { setUserOnline, setUserOffline, setOnlineUsers } from "./features/slices/chatSlice";
import socket, { startPing } from './lib/socket'; // ✅ Import your socket instance
import CheckCalendarSuccess from './Private/CheckCalendarSuccess';
function App() {
  // const user=useSelector((state) => state.auth.user);
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (user) {
      dispatch(setUser(user)); // Update Redux state with the user data
    }
  }, [user, dispatch]);

  useEffect(() => {
    socket.on("userOnline", ({ userId }) => {
      dispatch(setUserOnline(userId));
    });

    socket.on("userOffline", ({ userId }) => {
      dispatch(setUserOffline(userId));
    });

    socket.on("initialOnlineUsers", (userIds) => {
      dispatch(setOnlineUsers(userIds)); // replace entire list

    });
socket.on("startPing", () => {
  startPing();
});
 
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setupSocket(user._id); // Ensure user joins their socket room
    }
  }, [user]);

  if (isLoading) {
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(10)].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>  }
  return (
    <Router>
      <ToastContainer position="top-center" />
      <div>
      
        <HelmetProvider>
         
       
        
         <Routes>
         <Route path="/vendor-dashboard" element={<Vendordashboard />}>
          <Route path="my-events" element={<MyEvents />} />
          <Route path="messages" element={<ChatInterface />} />
          <Route path="" element={<Body />} />
          <Route path="notifications" element={<NotificationsPage />} />  
          <Route path="profile" element={<VendorProfile />} />  
         </Route>
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
          <Route index element={<EventPage />} />
          {/* <Route path="/" element={<EventPage />} /> */}
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
          <Route path="/organizer-dashboard?tab=chatting" element={<OriganizerDashboard />} />
           <Route path="/updateEvent/:id" element={<UpdateEventPage />} />
            <Route path="/wallet" element={<UserTickets />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path='/calendar' element={<CalendarView/>}/>
            <Route path='/booked' element={<BookingsTable />} />
            <Route path='/show-not' element={<NotificationsPage />} />
              <Route path="/success/calendar" element={<CheckCalendarSuccess />} />

            <Route path='/:id/booking-summary' element={<BookingSummary />} />            
            <Route path='/:id/booking-summary' element={<BookingSummary />} />
            <Route path='/success' element={<SuccessPage />} />
              <Route path='/scanQR' element={<ScanQR />} />
              <Route path='/vendors' element={<GetAllVendor />} />
              <Route path="/vendors/:id" element={<VendorDetail  />} />
              <Route path="/organizers/:id" element={<OrganizerDetails />} />
              <Route path="/categories/:id/events" element={<CategoryEvents />} />
              <Route path="/city-events/:city" element={<CityEvents />} />

          </Route>
          </Routes>
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
