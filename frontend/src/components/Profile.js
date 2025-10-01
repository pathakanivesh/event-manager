import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { API_BASE_URL } from '../config';  // ADD THIS IMPORT

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchBookings = async () => {
        try {
          // UPDATE THIS LINE:
          const res = await axios.get(`${API_BASE_URL}/api/bookings/user/${parsedUser.email}`);
          setBookings(res.data);
        } catch (err) {
          console.error('Failed to fetch bookings:', err);
        }
      };

      fetchBookings();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <h2>Hello bhai, {user.name}</h2>

      <div style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h3>Profile Info</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3>Your Bookings</h3>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map(booking => (
            <div key={booking._id} style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginBottom: '30px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              {/* Event Image */}
              <div style={{ flex: '1 1 250px' }}>
                <img
                  src={booking.eventId?.images?.[0]}
                  alt={booking.eventId?.title || 'Event Image'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Booking Info & Mobile Ticket */}
              <div style={{ flex: '2 1 400px', padding: '20px' }}>
                <h4>{booking.eventId?.title || 'Event Removed'}</h4>
                <p><strong>Location:</strong> {booking.eventId?.location}</p>
                <p><strong>Date:</strong> {new Date(booking.eventId?.date).toLocaleDateString()}</p>
                <p><strong>Price:</strong> ₹{booking.amount / 100}</p>
                <p><strong>Booking ID:</strong> {booking._id}</p>
                <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>

                {/* Mobile Ticket Layout */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  marginTop: '15px',
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                  <QRCodeCanvas
                    value={`${API_BASE_URL}/ticket/${booking._id}`}  // UPDATED THIS LINE TOO
                    size={100}
                  />

                  <img
                    src={booking.eventId?.images?.[0]}
                    alt="Ticket Preview"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                  />

                  <div>
                    <p style={{ margin: 0 }}><strong>Mobile Ticket</strong></p>
                    <p style={{ fontSize: '12px', margin: 0 }}>Scan at venue</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;