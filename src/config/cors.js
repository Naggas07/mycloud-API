const cors = require("cors");

const corsMiddleware = cors({
  origin: "http://localhost:3000",
  credentials: true,
  // methods: "GET, PATCH, PUT, POST, DELETE, OPTIONS",
  // allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsMiddleware;
