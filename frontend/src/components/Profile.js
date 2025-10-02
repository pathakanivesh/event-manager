import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState({ totalBookings: 0, totalSpent: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchBookings(parsedUser.email);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchBookings = async (email) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/bookings/user/${email}`);
      setBookings(res.data);
      
      // Calculate stats
      const totalSpent = res.data.reduce((sum, booking) => sum + (booking.amount / 100), 0);
      setStats({
        totalBookings: res.data.length,
        totalSpent: totalSpent
      });
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const downloadTicket = (booking) => {
    // Create a printable ticket
    const ticketWindow = window.open('', '_blank');
    ticketWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${booking.eventId?.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            .ticket { border: 2px dashed #333; padding: 20px; border-radius: 10px; text-align: center; }
            .qr-code { margin: 20px 0; }
            .event-image { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; }
            .header { background: #4299e1; color: white; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h2>🎫 Event Ticket</h2>
            </div>
            <img src="${booking.eventId?.images?.[0]}" alt="Event" class="event-image" />
            <h3>${booking.eventId?.title || 'Event'}</h3>
            <p><strong>Location:</strong> ${booking.eventId?.location}</p>
            <p><strong>Date:</strong> ${new Date(booking.eventId?.date).toLocaleDateString()}</p>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <div class="qr-code">
              <img src="${document.querySelector(`#qr-${booking._id}`)?.toDataURL()}" alt="QR Code" style="width: 150px; height: 150px;" />
            </div>
            <p><small>Present this ticket at the venue</small></p>
          </div>
        </body>
      </html>
    `);
    ticketWindow.document.close();
  };

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const eventDateObj = new Date(eventDate);
    if (eventDateObj < now) return { status: 'Completed', color: '#718096' };
    if ((eventDateObj - now) / (1000 * 60 * 60 * 24) <= 7) return { status: 'Upcoming', color: '#ed8936' };
    return { status: 'Confirmed', color: '#38a169' };
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={styles.greeting}>Hello, {user.name}!
</h1>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalBookings}</h3>
            <p style={styles.statLabel}>Total Bookings</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <h3 style={styles.statNumber}>₹{stats.totalSpent}</h3>
            <p style={styles.statLabel}>Total Spent</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div>
            <h3 style={styles.statNumber}>
              {stats.totalBookings >= 10 ? 'Gold' : stats.totalBookings >= 5 ? 'Silver' : 'Bronze'}
            </h3>
            <p style={styles.statLabel}>Member Tier</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          style={activeTab === 'bookings' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('bookings')}
        >
          🎫 My Bookings
        </button>
        <button 
          style={activeTab === 'profile' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile Info
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'bookings' && (
          <div>
            <h2 style={styles.sectionTitle}>Your Event Bookings</h2>
            {loading ? (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Loading your bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🎭</div>
                <h3>No Bookings Yet</h3>
                <p>You haven't booked any events yet.</p>
                <button 
                  onClick={() => navigate('/')}
                  style={styles.ctaButton}
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div style={styles.bookingsGrid}>
                {bookings.map(booking => {
                  const eventStatus = getEventStatus(booking.eventId?.date);
                  return (
                    <div key={booking._id} style={styles.bookingCard}>
                      <div style={styles.bookingHeader}>
                        <span style={{...styles.statusBadge, backgroundColor: eventStatus.color}}>
                          {eventStatus.status}
                        </span>
                        <button 
                          onClick={() => downloadTicket(booking)}
                          style={styles.downloadButton}
                        >
                          📥 Download
                        </button>
                      </div>
                      
                      <div style={styles.bookingContent}>
                        <img
                          src={booking.eventId?.images?.[0]}
                          alt={booking.eventId?.title || 'Event Image'}
                          style={styles.eventImage}
                        />
                        
                        <div style={styles.bookingDetails}>
                          <h3 style={styles.eventTitle}>{booking.eventId?.title || 'Event Removed'}</h3>
                          
                          <div style={styles.detailsGrid}>
                            <div style={styles.detailItem}>
                              <span style={styles.detailIcon}>📍</span>
                              <span>{booking.eventId?.location}</span>
                            </div>
                            <div style={styles.detailItem}>
                              <span style={styles.detailIcon}>📅</span>
                              <span>{new Date(booking.eventId?.date).toLocaleDateString()}</span>
                            </div>
                            <div style={styles.detailItem}>
                              <span style={styles.detailIcon}>💰</span>
                              <span>₹{booking.amount / 100}</span>
                            </div>
                            <div style={styles.detailItem}>
                              <span style={styles.detailIcon}>🆔</span>
                              <span style={styles.bookingId}>{booking._id}</span>
                            </div>
                          </div>

                          {/* QR Code Section */}
                          <div style={styles.qrSection}>
                            <div style={styles.qrContainer}>
                              <QRCodeCanvas
                                id={`qr-${booking._id}`}
                                value={`${window.location.origin}/ticket/${booking._id}`}
                                size={80}
                                style={styles.qrCode}
                              />
                              <div style={styles.qrInfo}>
                                <p style={styles.qrTitle}>Mobile Ticket</p>
                                <p style={styles.qrSubtitle}>Scan at venue</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={styles.profileSection}>
            <h2 style={styles.sectionTitle}>Profile Information</h2>
            <div style={styles.profileCard}>
              <div style={styles.profileField}>
                <label style={styles.profileLabel}>Full Name</label>
                <p style={styles.profileValue}>{user.name}</p>
              </div>
              <div style={styles.profileField}>
                <label style={styles.profileLabel}>Email Address</label>
                <p style={styles.profileValue}>{user.email}</p>
              </div>
              <div style={styles.profileField}>
                <label style={styles.profileLabel}>Phone Number</label>
                <p style={styles.profileValue}>{user.phone || 'Not provided'}</p>
              </div>
              <div style={styles.profileField}>
                <label style={styles.profileLabel}>Member Since</label>
                <p style={styles.profileValue}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e2e8f0'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#4299e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  greeting: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c'
  },
  userEmail: {
    margin: 0,
    color: '#718096',
    fontSize: '16px'
  },
  logoutButton: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid #e2e8f0'
  },
  statIcon: {
    fontSize: '24px'
  },
  statNumber: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c'
  },
  statLabel: {
    margin: 0,
    color: '#718096',
    fontSize: '14px'
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '1px solid #e2e8f0'
  },
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#718096',
    borderBottom: '2px solid transparent'
  },
  activeTab: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#4299e1',
    borderBottom: '2px solid #4299e1',
    fontWeight: '600'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    margin: '0 0 25px 0',
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a202c'
  },
  loading: {
    textAlign: 'center',
    padding: '40px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4299e1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  ctaButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px'
  },
  bookingsGrid: {
    display: 'grid',
    gap: '20px'
  },
  bookingCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#f7fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  },
  downloadButton: {
    backgroundColor: 'transparent',
    border: '1px solid #4299e1',
    color: '#4299e1',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  },
  bookingContent: {
    display: 'flex',
    padding: '20px'
  },
  eventImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '20px'
  },
  bookingDetails: {
    flex: 1
  },
  eventTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '15px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#4a5568'
  },
  detailIcon: {
    fontSize: '16px'
  },
  bookingId: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#718096'
  },
  qrSection: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0'
  },
  qrContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  qrCode: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '5px'
  },
  qrInfo: {
    flex: 1
  },
  qrTitle: {
    margin: '0 0 4px 0',
    fontWeight: '600',
    fontSize: '14px'
  },
  qrSubtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#718096'
  },
  profileSection: {
    maxWidth: '500px'
  },
  profileCard: {
    backgroundColor: '#f7fafc',
    padding: '25px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  profileField: {
    marginBottom: '20px'
  },
  profileLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '5px'
  },
  profileValue: {
    margin: 0,
    fontSize: '16px',
    color: '#1a202c',
    padding: '8px 12px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e2e8f0'
  }
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Profile;