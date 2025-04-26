import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routers.js";
import branchRoutes from "./routes/branch.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

import i18next from "./config/i18n.js";
import middleware from "i18next-http-middleware";
import cors from "cors";
import seedRoles from "./seeders/role.seeder.js";
import seedCurrencies from "./seeders/currency.seeder.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(middleware.handle(i18next));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/", transactionRoutes);

app.get("/welcome", (req, res) => {
  res.json({ message: req.t("welcome") });
});

const PORT = process.env.PORT || 3000;

sequelize;

sequelize
  .sync()

  .then(async () => {
    console.log("DB Synced with alter: true!");
    await seedRoles();
    await seedCurrencies();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to sync DB:", err));

// sequelize.sync({ force: true })
//   .then(async () => {
//     console.log("DB Synced with force: true!");
//     await seedRoles();
//     await seedCurrencies();
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error("Failed to sync DB:", err));
