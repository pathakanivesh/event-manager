const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (to, name) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER, // e.g., verified sender like 'no-reply@yourdomain.com'
    subject: 'Welcome to Event Manager!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name}, 👋</h2>
        <p>Thanks for signing up at <strong>Event Manager</strong>.</p>
        <p>You can now explore events and book tickets easily.</p>
        <br/>
        <p>🎉 Happy Exploring!</p>
        <p><em>- Team Event Manager</em></p>
      </div>
    `,
  };

  await sgMail.send(msg);
};

module.exports = sendWelcomeEmail;
