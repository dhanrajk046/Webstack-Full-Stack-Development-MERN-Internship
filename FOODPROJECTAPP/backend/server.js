const app = require("./app");
const connectDB = require("./config/database");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect Database
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});