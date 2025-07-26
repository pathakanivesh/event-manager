const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendWelcomeWhatsApp = async (toPhoneNumber, userName) => {
  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886', 
      to: `whatsapp:${toPhoneNumber}`, 
      body: `👋 Hello ${userName}, welcome to our platform! 🎉 We're excited to have you on board.`
    });
    console.log("WhatsApp message sent!");
  } catch (err) {
    console.error('Failed to send WhatsApp message:', err);
  }
};

module.exports = sendWelcomeWhatsApp;
