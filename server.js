const http = require('http');
const express = require('express');
const app = express();

app.use(express.static("dist"));

app.listen(8000, function () {
    console.log("Server started at port 8000!");
});