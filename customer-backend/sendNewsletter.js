const mysql = require("mysql2");
const nodemailer = require("nodemailer");

// Set up your MySQL pool (reuse your config)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "CrimsonTide2025#", // use your actual password
  database: "customer_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Set up your email transporter (use your real email credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD" // Use an app password if using Gmail
  }
});

// Query all subscribed users
pool.query(
  "SELECT email, firstName FROM subscriptionlist WHERE unsubscribed = 0",
  (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return;
    }

    results.forEach(user => {
      // Generate a unique unsubscribe link (for demo, just use email)
      const unsubscribeLink = `http://localhost:3000/api/unsubscribe?email=${encodeURIComponent(user.email)}`;

      const mailOptions = {
        from: '"WashWizards" <YOUR_EMAIL@gmail.com>',
        to: user.email,
        subject: "WashWizards Newsletter",
        html: `
          <p>Hi ${user.firstName},</p>
          <p>This is your latest WashWizards newsletter!</p>
          <p>...your newsletter content here...</p>
          <hr>
          <p style="font-size:0.9em">
            <a href="${unsubscribeLink}">Unsubscribe</a> from future emails.
          </p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending to ${user.email}:`, error);
        } else {
          console.log(`Newsletter sent to ${user.email}: ${info.response}`);
        }
      });
    });
  }
);