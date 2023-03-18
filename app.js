const {config} = require("dotenv")
config()
require("express-async-errors")
const express = require("express")
const app = express()
const mongoose = require("mongoose")

const userRouter = require("./routes/userRoutes")
const notFound = require("./middlewares/not-found")
const errorHandler = require("./middlewares/errorHandler")

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to Kontaktz App!</h1>")
})

app.use("/api/v1/user", userRouter)

app.use(errorHandler)
app.use(notFound)

const port = 3000 || process.env.PORT

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`App listening to port ${port}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start()



