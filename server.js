const express = require('express');
const app = express();

const fs = require('fs');

// Serve webpack built files
app.use(express.static("dist"));

// Middleware example
app.use( (req, res, next) => {
    next();
})

// Runs on port 8000
app.listen(8000, () => {
    console.log("Server started at port 8000!");
});

// Create an endpoint for getting todo items via file.
app.get("/Todo", (req, res) => {
    fs.readFile('./src/Todo.txt', (err, data) => {
        if (err) throw err;
        else {
            res.send(data.toString('utf8'));
        }
    });
});