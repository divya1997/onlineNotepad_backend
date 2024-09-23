const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Create a transporter for sending emails using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'onlinenotepads@gmail.com',  // Replace with your email
    pass: 'cpeqelgduitwirja',   // Replace with your email password
  },
});

app.post('/send-email', (req, res) => {
  const { emailList, note } = req.body;

  if (!emailList || !note) {
    return res.status(400).send('Email and note are required.');
  }

  const mailOptions = {
    from: 'onlinenotepads@gmail.com',
    to: emailList, // Multiple recipients
    subject: 'Your Notepad Note',
    text: `Here is your note: \n\n${note}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email.');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully!');
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
