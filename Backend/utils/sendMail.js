const nodemailer = require('nodemailer');

const sendMail = async (formData) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: formData.email,
    to: process.env.APP_EMAIL,
    subject: 'New Turf Owner Request',
    html: `
      <h3>Owner Name: ${formData.name}</h3>
      <p>Email: ${formData.email}</p>
      <p>Contact: ${formData.contact}</p>
      <p>Turf Name: ${formData.turfName}</p>
      <p>Location: ${formData.location}</p>
      <p>Message: ${formData.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
