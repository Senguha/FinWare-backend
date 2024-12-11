const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = {
  origin: ["https://react-vite-red-sigma.vercel.app", "http://localhost:5173", "http://localhost:5000"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const compRouter = require("../routes/companies");
const contactRouter = require("../routes/contacts");
const countryRouter = require('../routes/countries')
const userRouter = require('../routes/users')
const paramRouter = require('../routes/params')
const reportRouter = require('../routes/reports')

app.use("/companies", compRouter);
app.use("/contacts", contactRouter);
app.use("/countries", countryRouter);
app.use("/users", userRouter);
app.use("/params", paramRouter);
app.use("/reports", reportRouter);

BigInt.prototype.toJSON = function () {
    return this.toString();
};

app.get("/", (req, res) => res.send("Express on Vercel"));


app.listen(5000, () => console.log(`Server has started on port: 5000`));

module.exports = app;
