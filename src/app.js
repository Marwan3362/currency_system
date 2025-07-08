import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routers.js";
import branchRoutes from "./routes/branch.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/fetchUsers.routes.js";
import currencyRoutes from "./routes/currency.routes.js";
import safeRoutes from "./routes/safe.routes.js";
import i18next from "./config/i18n.js";
import middleware from "i18next-http-middleware";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";

dotenv.config();
const app = express();

const httpServer = createServer(app);

const io = new SocketIO(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(" WebSocket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("WebSocket disconnected:", socket.id);
  });
});

// Paths setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(middleware.handle(i18next));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/safes", safeRoutes);

app.get("/welcome", (req, res) => {
  res.json({ message: req.t("welcome") });
});

// Start
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(` Server + WebSocket running on http://localhost:${PORT}`)
);
