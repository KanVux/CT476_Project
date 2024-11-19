const express = require("express");
const cors = require("cors");
const BookRouter = require("./app/routes/book.route")

conts
const app = express();

app.use(cors())
app.use(express.json())
app.use("/api/books", booksRouter);

app.get("/", (req, res) => {
    res.json({message: "Welcome to book rental application"})
});

module.exports = app;