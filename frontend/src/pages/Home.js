import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const bannerImages = [
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80'
];

const categories = [
  'All Events',
  'Music',
  'Technology',
  'Food & Drink',
  'Sports',
  'Arts',
  'Business',
  'Education'
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [bannerIndex, setBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(res.data);
      setFilteredEvents(res.data);
      
      const initialIndexes = {};
      res.data.forEach(event => {
        if (event.images?.length > 1) {
          initialIndexes[event._id] = 0;
        }
      });
      setImageIndexes(initialIndexes);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort events
  useEffect(() => {
    let result = [...events];

    // Search filter
    if (searchTerm) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All Events') {
      result = result.filter(event => 
        event.category === selectedCategory
      );
    }

    // Sort events
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(result);
  }, [events, searchTerm, selectedCategory, sortBy]);

  // Rotate event images every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes(prevIndexes => {
        const newIndexes = { ...prevIndexes };
        events.forEach(event => {
          if (event.images?.length > 1) {
            const currentIndex = prevIndexes[event._id] || 0;
            newIndexes[event._id] =
              currentIndex === event.images.length - 1 ? 0 : currentIndex + 1;
          }
        });
        return newIndexes;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [events]);

  // Rotate banner images every 6s
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(bannerTimer);
  }, []);

  const getEventStatus = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const timeDiff = eventDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return { status: 'Past', color: 'danger' };
    if (daysDiff <= 7) return { status: 'Soon', color: 'warning' };
    return { status: 'Upcoming', color: 'success' };
  };

  const getPriceRange = (price) => {
    if (price < 500) return '₹';
    if (price < 2000) return '₹₹';
    return '₹₹₹';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spinner animation="border" style={styles.spinner} />
        <p style={styles.loadingText}>Loading amazing events...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Enhanced Hero Banner */}
      <div style={styles.heroBanner}>
        <img
          src={bannerImages[bannerIndex]}
          alt="Event Banner"
          style={styles.bannerImage}
        />
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Discover Unforgettable Experiences</h1>
            <p style={styles.heroSubtitle}>
              From music festivals to tech conferences, find events that inspire you
            </p>
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{events.length}+</span>
                <span style={styles.statLabel}>Events</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>24/7</span>
                <span style={styles.statLabel}>Support</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>100%</span>
                <span style={styles.statLabel}>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Container style={styles.filterSection}>
        <Row className="align-items-center">
          <Col md={4}>
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search events, locations, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="date">Sort by: Date</option>
              <option value="price-low">Sort by: Price (Low to High)</option>
              <option value="price-high">Sort by: Price (High to Low)</option>
              <option value="name">Sort by: Name</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <div style={styles.resultsCount}>
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Events Grid */}
      <Container style={styles.eventsContainer}>
        {filteredEvents.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎭</div>
            <h3>No Events Found</h3>
            <p>Try adjusting your search or filters</p>
            <Button 
              variant="primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Events');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <h2 style={styles.sectionTitle}>
              {selectedCategory === 'All Events' ? 'Featured Events' : selectedCategory}
            </h2>
            <Row>
              {filteredEvents.map(event => {
                const currentImageIndex = imageIndexes[event._id] || 0;
                const currentImage = event.images?.[currentImageIndex];
                const eventStatus = getEventStatus(event.date);
                const priceRange = getPriceRange(event.price);

                return (
                  <Col key={event._id} sm={12} md={6} lg={4} className="mb-4">
                    <Card style={styles.eventCard}>
                      {/* Event Image with Badges */}
                      <div style={styles.cardImageContainer}>
                        {currentImage && (
                          <img
                            src={currentImage}
                            alt={event.title}
                            style={styles.cardImage}
                          />
                        )}
                        <div style={styles.cardBadges}>
                          <span style={{...styles.statusBadge, ...styles[eventStatus.color]}}>
                            {eventStatus.status}
                          </span>
                          <span style={styles.priceRangeBadge}>
                            {priceRange}
                          </span>
                        </div>
                      </div>

                      <Card.Body style={styles.cardBody}>
                        {/* Event Category */}
                        {event.category && (
                          <div style={styles.categoryTag}>
                            {event.category}
                          </div>
                        )}

                        {/* Event Title */}
                        <Card.Title style={styles.eventTitle}>
                          {event.title}
                        </Card.Title>

                        {/* Event Details */}
                        <div style={styles.eventDetails}>
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📅</span>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📍</span>
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Event Description */}
                        <Card.Text style={styles.eventDescription}>
                          {event.description?.slice(0, 120)}...
                        </Card.Text>

                        {/* Price and Action */}
                        <div style={styles.cardFooter}>
                          <div style={styles.priceSection}>
                            <span style={styles.price}>₹{event.price}</span>
                            <span style={styles.priceLabel}>per ticket</span>
                          </div>
                          <Button
                            as={Link}
                            to={`/event/${event._id}`}
                            variant="primary"
                            style={styles.viewButton}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Container>

      {/* Call to Action */}
      <div style={styles.ctaSection}>
        <Container>
          <Row className="text-center">
            <Col>
              <h3 style={styles.ctaTitle}>Can't Find What You're Looking For?</h3>
              <p style={styles.ctaText}>
                Sign up to get notified about new events and exclusive offers
              </p>
              <Button 
                as={Link} 
                to="/register" 
                variant="outline-light" 
                size="lg"
                style={styles.ctaButton}
              >
                Join Now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: '40px'
  },
  spinner: {
    width: '3rem',
    height: '3rem',
    marginBottom: '20px'
  },
  loadingText: {
    color: '#6c757d',
    fontSize: '18px'
  },
  heroBanner: {
    position: 'relative',
    height: '400px',
    marginBottom: '40px',
    overflow: 'hidden'
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroContent: {
    textAlign: 'center',
    color: 'white',
    maxWidth: '600px',
    padding: '20px'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '16px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    opacity: 0.9
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.8
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '40px'
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#6c757d',
    fontSize: '18px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  filterSelect: {
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px'
  },
  resultsCount: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '14px',
    fontWeight: '600'
  },
  eventsContainer: {
    marginBottom: '60px'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#1a202c'
  },
  eventCard: {
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    height: '100%',
    overflow: 'hidden'
  },
  cardImageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  cardBadges: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase'
  },
  success: { backgroundColor: '#38a169' },
  warning: { backgroundColor: '#ed8936' },
  danger: { backgroundColor: '#e53e3e' },
  priceRangeBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#1a202c'
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 200px)'
  },
  categoryTag: {
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'inline-block'
  },
  eventTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1a202c',
    lineHeight: '1.3'
  },
  eventDetails: {
    marginBottom: '12px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#718096',
    marginBottom: '4px'
  },
  detailIcon: {
    color: '#a0aec0',
    fontSize: '14px'
  },
  eventDescription: {
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.4',
    flex: 1,
    marginBottom: '16px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  priceSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  price: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c'
  },
  priceLabel: {
    fontSize: '12px',
    color: '#718096'
  },
  viewButton: {
    backgroundColor: '#4299e1',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  ctaSection: {
    backgroundColor: '#4299e1',
    color: 'white',
    padding: '60px 0'
  },
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '16px'
  },
  ctaText: {
    fontSize: '1.1rem',
    marginBottom: '30px',
    opacity: 0.9
  },
  ctaButton: {
    padding: '12px 30px',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderWidth: '2px'
  }
};

export default Home;