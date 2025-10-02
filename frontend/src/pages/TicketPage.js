import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // REPLACED THE IMPORT

const TicketPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        // UPDATE THIS LINE:
        const res = await axios.get(`${API_BASE_URL}/api/bookings/${id}`);
        setTicket(res.data);
      } catch (err) {
        console.error('Error fetching ticket:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <h2>Loading ticket...</h2>;
  if (!ticket) return <h2>Ticket not found</h2>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
      <h2>🎫 Event Ticket</h2>
      <img
        src={ticket.eventId?.images?.[0]}
        alt="Event"
        style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <h3>{ticket.eventId?.title}</h3>
      <p><strong>Location:</strong> {ticket.eventId?.location}</p>
      <p><strong>Date:</strong> {new Date(ticket.eventId?.date).toLocaleDateString()}</p>
      <p><strong>Booking ID:</strong> {ticket._id}</p>
      <p><strong>Booked For:</strong> {ticket.userEmail}</p>
      <p><strong>Amount:</strong> ₹{ticket.amount / 100}</p>
      <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default TicketPage;