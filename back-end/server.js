const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to the Excel file
const filePath = path.join(__dirname, "data.xlsx");

// Function to load customer data from the Excel file
const loadCustomerData = () => {
  if (!fs.existsSync(filePath)) return [];
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data;
};

// Route to load customer data
app.get("/load", (req, res) => {
  const customers = loadCustomerData();
  res.json(customers);
});

// Route to update customer calendar status
app.post("/update", (req, res) => {
  const updatedCustomers = req.body;
  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(updatedCustomers);
  xlsx.utils.book_append_sheet(workbook, sheet, "Sheet1");
  xlsx.writeFile(workbook, filePath);
  res.send("Data updated successfully!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
