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
import { useDispatch } from 'react-redux';
import { setUser } from './features/slices/authSlice';
import { useEffect } from 'react';
import UserProfile from './UserPage/Getprofiles';
import MyEventsPage from './Origanizer/MyEvent'
import UpdateEventPage from './Origanizer/UpdateEvent';
import OriganizerDashboard from './Origanizer/Dashboard';
import PaymentPage from './Private/Payment';
import BookingSummary from './pages/BookingSummary';
import SuccessPage from './Private/SuccessPage'
function App() {
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user)); // Update Redux state with the user data
    }
  }, [user, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <Router>
       <div>
         <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<EventPage />} />
          {/* <Route path="/" element={<EventPage />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/useraccount" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events" element={<EventPage />} />
            <Route path="/Origanizer-dashboard" element={<OriganizerDashboard />} />
           <Route path="/myEvent" element={<MyEventsPage />} />
           <Route path="/updateEvent/:id" element={<UpdateEventPage />} />
 
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path='/calendar' element={<CalendarView/>}/>
            <Route path='/payment' element={<PaymentPage />} />
            <Route path='/:id/booking-summary' element={<BookingSummary />} />
            <Route path='/:id/booking-summary' element={<BookingSummary />} />
            <Route path='/success' element={<SuccessPage />} />


          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

