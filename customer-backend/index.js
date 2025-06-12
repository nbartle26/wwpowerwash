const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nickbartle2@gmail.com", // your business email
    pass: "lagf hkuj xybc tddb"           // use an app password, not your real password
  }
});

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "CrimsonTide2025#", // replace with your actual password
  database: "customer_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/api/customers", (req, res) => {
    const { firstName, lastName, email, phone, address, bookingDate, timeSlot, additionalInfo } = req.body;  
    console.log("Received customer data:", req.body);

  // Inside your app.post("/api/customers", ...) after a successful DB insert:
    const mailOptions = {
      from: "nickbartle2@gmail.com",
      to: "nick00baseball@gmail.com", // your client's email address
      subject: "New Booking Received",
      text: `A new booking has been made:\n
    Name: ${firstName} ${lastName}
    Email: ${email}
    Phone: ${phone}
    Address: ${address}
    Date: ${bookingDate}
    Time Slot: ${timeSlot}
    Additional Info: ${additionalInfo || "None"}
    `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

  const sql =
    "INSERT INTO customers (firstName, lastName, email, phone, address, bookingDate, timeSlot) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [firstName, lastName, email, phone, address, bookingDate, timeSlot];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ message: "Error storing customer info" });
    }

    console.log("Customer saved to database:", result);
    res.status(201).json({ message: "Customer added successfully!" });
  });
});

app.get("/api/booked-slots", (req, res) => {
  pool.query(
    "SELECT bookingDate, timeSlot FROM customers",
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching booked slots" });
      }
      // Format bookingDate as YYYY-MM-DD
      const booked = results.map(row => {
        let dateStr = "";
        if (row.bookingDate instanceof Date) {
          dateStr = row.bookingDate.toISOString().slice(0, 10);
        } else if (typeof row.bookingDate === "string") {
          // Try to parse and format as YYYY-MM-DD
          const d = new Date(row.bookingDate);
          if (!isNaN(d)) dateStr = d.toISOString().slice(0, 10);
        }
        return `${dateStr}_${row.timeSlot}`;
      });
      res.json(booked);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.post("/api/subscribe", (req, res) => {
const { firstName, lastName, email, phone, address, bookingDate, timeSlot, additionalInfo } = req.body;  if (!firstName || !lastName || !email || !phone || !address) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length !== 10) {
    return res.status(400).json({ message: "Invalid phone number." });
  }
  const sql =
    "INSERT INTO subscriptionlist (firstName, lastName, email, phone, address) VALUES (?, ?, ?, ?, ?)";
  const values = [firstName, lastName, email, phone, address];
  pool.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "This email is already subscribed." });
      }
      console.error("DB Insert Error:", err);
      return res.status(500).json({ message: "Error storing subscription info" });
    }
    res.status(201).json({ message: "Subscription added successfully!" });
  });

});