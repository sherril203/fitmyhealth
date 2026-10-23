const mongoose = require('mongoose');
const server = require('./app');
require('dotenv').config();


const mongoose = require('mongoose');
require('dotenv').config();

const server = require('./app');

const mongodb_uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!mongodb_uri) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

mongoose.connect(mongodb_uri)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
