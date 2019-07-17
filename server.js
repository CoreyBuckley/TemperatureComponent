const express = require('express');
const app = express();

const fs = require('fs');

app.use(express.static("dist"));

app.use(function (req, res, next) {
    res.header('Access-Control-Expose-Headers', 'Content-Type');
    next();
})

app.listen(8000, function () {
    console.log("Server started at port 8000!");
});

app.get("/Todo", (req, res) => {
    fs.readFile('./src/Todo.txt', (err, data) => {
        if (err) throw err;
        else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data.toString('utf8'));
        }
    });
});