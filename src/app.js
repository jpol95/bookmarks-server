require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const bookmarkRouter = require('./bookmark/bookmark-router')
const validateBearerToken = require('./middleware/bearer-token')

const app = express();

const morganOption = (NODE_ENV === 'production')

app.use(errorHandler);
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(errorHandler)
app.use(validateBearerToken)

// console.log("Hello")
// console.log(bookmarkRouter)
app.use("/bookmarks", bookmarkRouter)
module.exports = app;
