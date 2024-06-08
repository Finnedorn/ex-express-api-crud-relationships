const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const postRouter = require("./router/postsRouter");
const categoryRouter = require("./router/categoryRouter");
const tagRouter = require("./router/tagRouter");
const notFoundFormatter = require("./middlewares/404errorFormatter");
const allErrorFormatter = require("./middlewares/allErrorFormatter");

app.use(express.json());

app.use("/posts", postRouter);

app.use("/categories", categoryRouter);

app.use("/tags", tagRouter);

app.use(notFoundFormatter);

app.use(allErrorFormatter);

app.listen(port, () => {
  console.log(`Sto runnando il server sulla porta: ${port}`);
});
