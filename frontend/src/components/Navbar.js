import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, Button, NavDropdown } from 'react-bootstrap';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <BootstrapNavbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" style={{ color: darkMode ? '#fff' : '#000' }}>
          EventBooking
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" style={{ color: darkMode ? '#fff' : '#000' }}>
                  {user.name}
                </Nav.Link>
              </>
            ) : (
              <>
              
                
                <Nav.Link as={Link} to="/register" style={{ color: darkMode ? '#fff' : '#000' }}>Register</Nav.Link>
                <Nav.Link as={Link} to="/login" style={{ color: darkMode ? '#fff' : '#000' }}>Login</Nav.Link>
                <Nav.Link as={Link} to="/contact" style={{ color: darkMode ? '#fff' : '#000' }}>Contact Us</Nav.Link>
              </>
            )}
            <Button
              variant={darkMode ? 'outline-light' : 'outline-dark'}
              onClick={toggleDarkMode}
              className="ms-3"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
