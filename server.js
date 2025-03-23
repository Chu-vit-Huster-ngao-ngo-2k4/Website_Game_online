const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => console.log("🚀 Server chạy trên port 5000"));
});
