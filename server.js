const express  = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./configs/key').mongoURI;

//Connect to mongoDB
mongoose.connect(db, {
    useNewUrlParser: true,
}).then(() => {
    console.log("MongoDB connected!");
})
.catch(err => console.log(err));

mongoose.set('useCreateIndex', true);

//Passport middleware
app.use(passport.initialize());

//  Passport config
require('./configs/passport')(passport);

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Welcome to my website'
    })
});

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.port | 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});