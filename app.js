const {config} = require("dotenv")
config()
require("express-async-errors")
const express = require("express")
const app = express()


const userRouter = require("./routes/userRoutes")
const notFound = require("./middlewares/not-found")

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to Kontaktz App!</h1>")
})

app.use("/api/v1/user", userRouter)

app.use(notFound)

const port = 3000 || process.env.PORT

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`App listening to port ${port}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start()



