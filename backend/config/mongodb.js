const { default: mongoose } = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {});
    console.log("MongoDB connected  successfully!!!");
  } catch (error) {
    console.error("MongoDb connection failed: ", error.message);
    process.exit(1); // thoát với mã lỗi là 1
  }
};
module.exports = connectDb;
