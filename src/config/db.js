// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  dialect: "mysql",
  dialectOptions: {
    charset: "utf8mb4",
  },
  define: {
    timestamps: true,
  },
  logging: false,
});

export default sequelize;
// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// const sequelize = new Sequelize({
//   database: process.env.DB_NAME,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   host: process.env.DB_HOST,
//   dialect: "mysql",
//   dialectOptions: {
//     charset: "utf8mb4",
//   },
//   define: {
//     timestamps: true,
//   },
//   logging: false,
// });

// export default sequelize;
