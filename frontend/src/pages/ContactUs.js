import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  return (
    <div style={styles.container}>
      <Container>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.subtitle}>Get in touch with us for any queries or support</p>
        </div>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card style={styles.contactCard}>
              <Card.Body style={styles.cardBody}>
                {/* Contact Information */}
                <div style={styles.contactInfo}>
                  <div style={styles.contactItem}>
                    <div style={styles.icon}>👤</div>
                    <div>
                      <h4 style={styles.label}>Name</h4>
                      <p style={styles.value}>Anivesh Pathak</p>
                    </div>
                  </div>

                  <div style={styles.contactItem}>
                    <div style={styles.icon}>📧</div>
                    <div>
                      <h4 style={styles.label}>Email</h4>
                      <p style={styles.value}>
                        <a href="mailto:anivesh1024pathak@gmail.com" style={styles.link}>
                          anivesh1024pathak@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div style={styles.contactItem}>
                    <div style={styles.icon}>📱</div>
                    <div>
                      <h4 style={styles.label}>Mobile Number</h4>
                      <p style={styles.value}>
                        <a href="tel:+918115580026" style={styles.link}>
                          +91 8115580026
                        </a>
                      </p>
                    </div>
                  </div>

                  <div style={styles.contactItem}>
                    <div style={styles.icon}>📍</div>
                    <div>
                      <h4 style={styles.label}>Address</h4>
                      <p style={styles.value}>Gurugram, Sector 59<br />Haryana, India</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={styles.actions}>
                  <a href="mailto:anivesh1024pathak@gmail.com" style={styles.actionButton}>
                    📧 Send Email
                  </a>
                  <a href="tel:+918115580026" style={styles.actionButton}>
                    📞 Call Now
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Info */}
        <Row className="mt-5">
          <Col md={6}>
            <Card style={styles.infoCard}>
              <Card.Body>
                <h4 style={styles.infoTitle}>💼 Professional Background</h4>
                <p style={styles.infoText}>
                  Full Stack Developer specializing in MERN stack applications. 
                  Passionate about creating scalable web applications and solving complex problems.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card style={styles.infoCard}>
              <Card.Body>
                <h4 style={styles.infoTitle}>🚀 Availability</h4>
                <p style={styles.infoText}>
                  Available for freelance projects, collaborations, and full-time opportunities. 
                  Feel free to reach out for technical discussions or project inquiries.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer Section */}
      <footer style={styles.footer}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p style={styles.footerText}>
                © 2025 Event Manager App. Built with ❤️ by Anivesh Pathak
              </p>
            </Col>
            <Col md={6}>
              <div style={styles.socialLinks}>
                <span style={styles.socialLabel}>Connect with me:</span>
                <div style={styles.socialIcons}>
                  {/* Instagram */}
                  <a 
                    href="https://www.instagram.com/aniv_eshpathak" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.socialLink}
                    title="Instagram"
                  >
                    📷 Instagram
                  </a>

                  {/* Facebook */}
                  <a 
                    href="https://www.facebook.com/anivesh.pathak.330" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.socialLink}
                    title="Facebook"
                  >
                    👤 Facebook
                  </a>

                  {/* LinkedIn */}
                  <a 
                    href="https://www.linkedin.com/in/anivesh-pathak-354ba521b/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.socialLink}
                    title="LinkedIn"
                  >
                    💼 LinkedIn
                  </a>

                  {/* Threads */}
                  <a 
                    href="https://www.threads.net/@aniv_eshpathak" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.socialLink}
                    title="Threads"
                  >
                    🧵 Threads
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    paddingBottom: '80px' // Space for footer
  },
  header: {
    textAlign: 'center',
    padding: '60px 0 40px 0'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#718096',
    maxWidth: '500px',
    margin: '0 auto'
  },
  contactCard: {
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  cardBody: {
    padding: '40px'
  },
  contactInfo: {
    marginBottom: '30px'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '25px',
    paddingBottom: '25px',
    borderBottom: '1px solid #e2e8f0'
  },
  icon: {
    fontSize: '24px',
    marginRight: '20px',
    marginTop: '4px',
    flexShrink: 0
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px'
  },
  value: {
    fontSize: '16px',
    color: '#4a5568',
    margin: 0,
    lineHeight: '1.5'
  },
  link: {
    color: '#4299e1',
    textDecoration: 'none',
    transition: 'color 0.2s'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  actionButton: {
    display: 'inline-block',
    backgroundColor: '#4299e1',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.2s',
    textAlign: 'center',
    minWidth: '140px'
  },
  infoCard: {
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    height: '100%'
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '12px'
  },
  infoText: {
    color: '#4a5568',
    lineHeight: '1.6',
    margin: 0
  },
  footer: {
    backgroundColor: '#1a202c',
    color: 'white',
    padding: '30px 0',
    marginTop: '60px',
    position: 'relative',
    bottom: 0,
    width: '100%'
  },
  footerText: {
    margin: 0,
    color: '#a0aec0',
    fontSize: '14px'
  },
  socialLinks: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '20px',
    flexWrap: 'wrap'
  },
  socialLabel: {
    color: '#a0aec0',
    fontSize: '14px'
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  socialLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }
};

// Add hover effects
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  .social-link:hover {
    background-color: rgba(255,255,255,0.2);
    transform: translateY(-1px);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .action-button:hover {
    background-color: #3182ce;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .contact-link:hover {
    color: #3182ce;
  }
`, styleSheet.cssRules.length);

export default ContactUs;