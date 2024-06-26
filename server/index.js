const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const stockRoute = require("./routes/stockRoute.js");
const purchaseRoute = require("./routes/purchaseRoute");
const salesRoute = require("./routes/salesRoute");
const userRoute = require("./routes/userRoute");
const reportRoute = require("./routes/reportRoute");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const db = require("./database/db.js");

const Sales = require("./models/sales");
const SalesDetail = require("./models/salesDetails.js");
const Product = require("./models/products");
const Stocks = require("./models/stocks");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

//Middleware for parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/stocks", stockRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/sales", salesRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/reports", reportRoute);

const PORT = process.env.PORT || 5000;

// Define associations
Sales.hasMany(SalesDetail, { foreignKey: "salesID", as: "details" });
SalesDetail.belongsTo(Sales, { foreignKey: "salesID", targetKey: "salesID" });
SalesDetail.belongsTo(Product, {
  foreignKey: "productID",
  targetKey: "productID",
});
SalesDetail.belongsTo(Stocks, { foreignKey: "stockID", targetKey: "stockID" });

db.sync()
  .then(() => {
    console.log("Database synced successfully");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing Purchase table:", error);
  });

// Instance
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = io;
