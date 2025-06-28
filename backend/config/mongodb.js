const { default: mongoose } = require("mongoose");

const connectDb = async () => {
  try {
    // Kiểm tra connection hiện tại
    if (mongoose.connections[0].readyState === 1) {
      console.log("Database already connected");
      return;
    }

    if (mongoose.connections[0].readyState === 2) {
      console.log("Database connection in progress");
      return;
    }

    // Kiểm tra MONGODB_URL
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }

    console.log("Attempting to connect to MongoDB...");

    const options = {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 5, // Giảm pool size cho serverless
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      family: 4,
      // Thêm các options cho serverless
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true
    };

    await mongoose.connect(process.env.MONGODB_URL, options);
    console.log("MongoDB connected successfully!");
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    
    // Log thêm thông tin debug
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error("Network error - check your MongoDB URL and network connectivity");
    }
    
    if (error.message.includes('authentication failed')) {
      console.error("Authentication error - check your username/password");
    }
    
    throw error;
  }
};

module.exports = connectDb;