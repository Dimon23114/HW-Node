const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./app");

dotenv.config({ path: "./.env" });

const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL)
  .then((connection) => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});