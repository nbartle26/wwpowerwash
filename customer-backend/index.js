const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection config
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'YOUR_MYSQL_PASSWORD', // ← replace with your actual MySQL password
  database: 'customer_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post('/api/customers', (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  console.log("Received customer data:", req.body); // <== Log input

  const sql = 'INSERT INTO customers (firstName, lastName, email, phone, address) VALUES (?, ?, ?, ?, ?)';
  const values = [firstName, lastName, email, phone, address];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err); // <== Log DB errors
      return res.status(500).json({ message: 'Error storing customer info' });
    }

    console.log("Customer saved to database:", result);
    res.status(201).json({ message: 'Customer added successfully!' });
  });
});

const timeSlots = ["8:00", "10:00", "12:00", "2:00", "4:00"];

const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth',
  selectable: true,
  
  // Customize each day cell content
  dayCellContent: function(arg) {
    // Clear default content
    const dateNumber = arg.dayNumberText; // e.g. "7"
    
    // Create container div
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '3px';
    
    // Date number at top
    const dateDiv = document.createElement('div');
    dateDiv.textContent = dateNumber;
    dateDiv.style.fontWeight = 'bold';
    dateDiv.style.marginBottom = '4px';
    container.appendChild(dateDiv);
    
    // Add green boxes for each timeslot
    timeSlots.forEach(slot => {
      const slotDiv = document.createElement('div');
      slotDiv.textContent = slot;
      slotDiv.style.backgroundColor = '#28a745'; // Bootstrap green
      slotDiv.style.color = 'white';
      slotDiv.style.fontSize = '0.75rem';
      slotDiv.style.borderRadius = '4px';
      slotDiv.style.padding = '2px 6px';
      slotDiv.style.cursor = 'pointer';
      slotDiv.style.width = '45px';
      slotDiv.style.textAlign = 'center';
      
      // Add click handler for the time slot box
      slotDiv.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering dateClick
        modal.classList.remove('hidden');
        bookingForm.setAttribute('data-date', arg.dateStr);
        bookingForm.timeSlot.value = slot; // set selected timeslot in form
      });

      container.appendChild(slotDiv);
    });

    return { domNodes: [container] };
  },

  dateClick: function(info) {
    // Optional: if user clicks day outside timeslots, open modal default or do nothing
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
