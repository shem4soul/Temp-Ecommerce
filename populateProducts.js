require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");

const connectDB = require("./db/connect");
const Product = require("./models/product");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const userId = "685c270a6be2c252e98e1384"; // ✅ Your user ID
    const productsRaw = JSON.parse(
      fs.readFileSync("./mockData/products.json", "utf-8")
    );

    // Inject user ID into each product
    const products = productsRaw.map((product) => ({
      ...product,
      user: userId,
    }));

    await Product.deleteMany(); // Optional: clear old products
    await Product.insertMany(products); // Insert mock data
    console.log("✅ Products inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting products:", error);
    process.exit(1);
  }
};

start();
