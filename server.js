const express  = require('express');

const app = express();

app.get('/', (req, res, next) => {
    res.send("Hello");
});

const port = process.eventNames.port | 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});