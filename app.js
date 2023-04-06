const express = require("express");
const cors = require("cors");
const homeRoutes = require("./routes/index");
const personRoutes = require("./routes/persons");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/", homeRoutes);
app.use("/api/persons", personRoutes);

module.exports = app;
