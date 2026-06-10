// const dotenv = require("dotenv");

// // 1. Load environment variables FIRST before requiring other files
// dotenv.config({ path: "./config/config.env" });

// // 2. Now import app and database connection configurations
// const app = require("./app");
// const connectDB = require("./config/database");

// // 3. Connect to MongoDB Atlas
// connectDB();

// // 4. Start the Express Server
// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log(`Server started on PORT: ${PORT}`);
// });

const dotenv = require("dotenv");

// 1. Load environment variables first
dotenv.config({ path: "./config/config.env" });

const app = require("./app");
const connectDB = require("./config/database");

// 2. Wrap server initialization in an async function
const startServer = async () => {
    try {
        // Force the app to wait until the DB is fully connected
        await connectDB();
        
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT} (DB fully verified)`);
        });
    } catch (error) {
        console.error("Critical Server Startup Failure:", error.message);
        process.exit(1);
    }
};

startServer();