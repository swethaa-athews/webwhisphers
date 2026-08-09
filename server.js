import dotenv from "dotenv";
dotenv.config();



import express from "express";
import cors from "cors";
import { Resend } from "resend";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";






const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.use(cors());
app.use(express.json());

// 🔥 Your Gmail
app.post("/send-email", async (req, res) => {
  const { email, orderId, total } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: "WebWhisper <orders@yourdomain.com>",
      to: [email],
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

          <p style="margin-top:20px;">
            Thank you for shopping with <b>WebWhisper</b> ❤️
          </p>
        </div>
      `
    });

    if (error) {
      console.error("❌ Resend error:", error);

      return res.status(500).json({
        success: false,
        message: "Email failed"
      });
    }

    console.log("✅ Email sent:", data);

    res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    console.error("❌ Email error:", error);

    res.status(500).json({
      success: false,
      message: "Email failed"
    });
  }
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "webwisphers.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
