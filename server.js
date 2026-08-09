import dotenv from "dotenv";
dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import twilio from "twilio";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);



const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.use(cors());
app.use(express.json());

// 🔥 Your Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS           // 👈 NOT normal password
  }
});

app.post("/send-email", async (req, res) => {
  const { email, orderId, total } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // ✅ dynamic user email
      subject: "Order Confirmation",
      html: `
  <div style="font-family: Arial; padding:20px;">
    <h2 style="color:#4CAF50;">Order Confirmed ✅</h2>
    
    <p>Hi there,</p>
    <p>Your order has been successfully placed 🎉</p>

    <div style="background:#f5f5f5; padding:15px; border-radius:10px;">
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total:</strong> ₹${total}</p>
    </div>

    <p style="margin-top:20px;">Thank you for shopping with <b>WebWhisper</b> ❤️</p>
  </div>
`
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent to:", email);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.json({ success: false });
  }
});

app.post("/send-sms", async (req, res) => {

  const { phone, orderId, total } = req.body;

  try {

    await client.messages.create({
      body: `Order Confirmed!
Order ID: ${orderId}
Total: ₹${total}

Thank you for shopping with WebWhispher.`,
      from: "+15017122661",   // Twilio number
      to: phone
    });

    console.log("SMS sent to:", phone);

    res.json({ success: true });

  } catch (error) {

    console.error("SMS error:", error);

    res.json({ success: false });

  }

});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "webwhisphers.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
