const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://samahsalah2555:samahsalah2555@ac-m5mdyev-shard-00-00.qhksjuq.mongodb.net:27017,ac-m5mdyev-shard-00-01.qhksjuq.mongodb.net:27017,ac-m5mdyev-shard-00-02.qhksjuq.mongodb.net:27017/?replicaSet=atlas-q5sx1o-shard-0&ssl=true&authSource=admin")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const ProductSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  itemPaid: { type: Boolean, default: false },
});

// Model
const Product = mongoose.model("Product", ProductSchema);

// CREATE
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ALL
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// READ ONE
app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

app.put("/products/:id/update/:key/:value", async (req, res) => {
  try {
    const { id, key, value } = req.params;

    let parsedValue = value;

    // لو القيمة Boolean لازم تتحول
    if (value === "true") parsedValue = true;
    if (value === "false") parsedValue = false;

    // لو القيمة Number
    if (!isNaN(value)) parsedValue = Number(value);

    const updateObj = {};
    updateObj[key] = parsedValue;

    const product = await Product.findByIdAndUpdate(id, updateObj, {
      new: true,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

// Start Server
app.listen(4000, () => console.log("Server running on port 4000"));
