import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Auto image change every 5 seconds
  useEffect(() => {
    if (event?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev =>
          prev === event.images.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const handlePayment = async () => {
    if (!event) return;
     const user = JSON.parse(localStorage.getItem("user"));

    try {
      const orderRes = await axios.post('http://localhost:5000/api/bookings/create-order', {
        amount: event.price * 100,
      });

      const { id: order_id, amount, currency } = orderRes.data;

      const options = {
        key: 'rzp_test_ktXZBAfWJZb4GP',
        amount,
        currency,
        name: 'Event Booking',
        description: event.title,
        order_id,
        handler: async function (response) {
          try {
            await axios.post('http://localhost:5000/api/bookings/confirm', {
              eventId: event._id,
              userEmail:  user?.email,
              amount,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert('Booking successful!');
            setMessage('Booking successful!');
          }catch (err) {
           
      console.error("Booking confirm error:", err);
            alert('Booking confirmation failed.');
            setMessage('Booking confirmation failed.');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setMessage('Payment failed to initiate.');
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: 'auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{event.title}</h2>

      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        minHeight: '300px'
      }}>
        {/* Event Details */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          background: '#f9f9f9',
          padding: '1rem',
          borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Price:</strong> ₹{event.price}</p>
          </div>
          <div>
            <button
              onClick={handlePayment}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%'
              }}
            >
              Book Now
            </button>
            {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
          </div>
        </div>

        {/* Rotating Image */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff'
        }}>
          {event.images && event.images.length > 0 ? (
            <img
              src={event.images[currentImageIndex]}
              alt={`${event.title} image ${currentImageIndex + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
