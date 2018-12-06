const express  = require('express');
const mongoose = require('mongoose');

const app = express();

//DB config
const db = require('./configs/key').mongoURI;

//Connect to mongoDB
mongoose.connect(db, {
    useNewUrlParser: true,
}).then(() => {
    console.log("MongoDB connected!");
})
.catch(err => console.log(err));

app.get('/', (req, res, next) => {
    res.send("Hello");
});

const port = process.eventNames.port | 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});