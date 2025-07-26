import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const bannerImages = [
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80'
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then(res => {
        setEvents(res.data);
        const initialIndexes = {};
        res.data.forEach(event => {
          if (event.images?.length > 1) {
            initialIndexes[event._id] = 0;
          }
        });
        setImageIndexes(initialIndexes);
      })
      .catch(err => console.error(err));
  }, []);

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

  return (
    <div>
      {/* Full width rotating banner with overlay */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <img
          src={bannerImages[bannerIndex]}
          alt="Event Banner"
          style={{
            width: '100%',
            height: '280px',
            objectFit: 'cover',
            borderRadius: '10px',
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '20px 40px',
          borderRadius: '10px'
        }}>
          <h2 style={{ margin: 0 }}>Welcome to Our Events</h2>
          <p style={{ marginTop: '10px' }}>Book your favorite event now</p>
          
        </div>
      </div>

      {/* Events List */}
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Upcoming Events</h2>
        <Row>
          {events.map(event => {
            const currentImageIndex = imageIndexes[event._id] || 0;
            const currentImage = event.images?.[currentImageIndex];

            return (
              <Col key={event._id} sm={12} md={6} lg={4} className="mb-4">
                <Card className="event-card" style={{ height: '100%', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>

                  {currentImage && (
                    <div className="card-img-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
  <img
    src={currentImage}
    alt={event.title}
    className="card-img"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>

                  )}
                  <Card.Body style={{
                    height: '200px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <Card.Title>{event.title}</Card.Title>
                      <Card.Subtitle >
                        {new Date(event.date).toLocaleDateString()} | {event.location}
                      </Card.Subtitle>
                      <Card.Text style={{ fontSize: '0.95rem' }}>
                        {event.description?.slice(0, 100)}...
                      </Card.Text>
                    </div>
                    <div>
                      <Card.Text><strong>Price:</strong> ₹{event.price}</Card.Text>
                      <Button
                        as={Link}
                        to={`/event/${event._id}`}
                        variant="primary"
                        className="w-100"
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
      </Container>
    </div>
  );
};

export default Home;
