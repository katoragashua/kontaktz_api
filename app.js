const { config } = require("dotenv");
config();
require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;
const ImageKit = require("imagekit");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const contactRouter = require("./routes/contactRoutes");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/errorHandler");
const User = require("./models/User");
const fileUpload = require("express-fileupload")

// Imagekit SDK configuration
const imageKit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});

// cloudinary SDK configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Use express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

// Use external packages
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to Kontaktz App!</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/contacts", contactRouter);

app.use(errorHandler);
app.use(notFound);

const port = 5000 || process.env.PORT;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // await User.deleteMany()
    app.listen(port, () => {
      console.log(`App listening to port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();