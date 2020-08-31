const cors = require("cors");
let originCors = null; //process.env.CORS_ORIGIN;

const corsMiddleware = cors({
  origin: originCors || "http://localhost:3000",
  credentials: true,
  // methods: "GET, PATCH, PUT, POST, DELETE, OPTIONS",
  // allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsMiddleware;
