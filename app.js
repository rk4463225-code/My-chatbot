require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// Middlewares
// =====================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// =====================
// MongoDB Connection
// =====================
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aiChat")
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Server start ONLY after DB connect
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  });

// =====================
// Routes
// =====================
app.use("/chat", chatRoutes);

// =====================
// Root Route (FIXED)
// =====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"));
});

// =====================
// Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// =====================
// Graceful Shutdown
// =====================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});