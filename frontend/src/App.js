import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import Checkout from './pages/Checkout';
import TicketPage from './pages/TicketPage';
import Profile from './components/Profile';
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ticket/:id" element={<TicketPage />} />
        {/* <Route path="/checkout/:id" element={<Checkout />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
