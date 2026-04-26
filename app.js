require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// =====================
// Middlewares
// =====================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// =====================
// MongoDB Connection (Modified for Vercel)
// =====================
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aiChat")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err.message));

// =====================
// Routes
// =====================
app.use("/chat", chatRoutes);

// =====================
// Root Route
// =====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =====================
// Export for Vercel (IMPORTANT)
// =====================
module.exports = app; 

// लोकल टेस्टिंग के लिए (यह Vercel पर असर नहीं डालेगा)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}
