const connectDb = require("../config/mongodb");

let isDbConnected = false; // Track if the database is connected
exports.mongoMiddleware = async (req, res, next) => {
  try {
    if (!isDbConnected) {
      console.log("Connecting to database...");
      await connectDb();
      isDbConnected = true;
      console.log("Database connected successfully");
      // Schedule cleanup only once and only in non-production
      scheduleCleanupOldFiles();
    }
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
