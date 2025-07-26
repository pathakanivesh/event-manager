const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateTicketPDF = (booking, event) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filename = `ticket-${booking._id}.pdf`;
    const filePath = path.join(__dirname, '..', 'tickets', filename);

    if (!fs.existsSync(path.join(__dirname, '..', 'tickets'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'tickets'));
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('🎟️ Event Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Event: ${event.title}`);
    doc.text(`Location: ${event.location}`);
    doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`);
    doc.text(`Booking ID: ${booking._id}`);
    doc.text(`User Email: ${booking.userEmail}`);
    doc.text(`Amount Paid: ₹${booking.amount / 100}`);
    doc.text(`Payment ID: ${booking.razorpay_payment_id}`);

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = generateTicketPDF;
