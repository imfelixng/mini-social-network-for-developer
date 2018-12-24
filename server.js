import moduleAlias from 'module-alias/register';
import express  from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';

const app = express();

import users from './routes/api/users';
import profile from './routes/api/profile';
import posts from './routes/api/posts';

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
import db from './configs/key';

//Connect to mongoDB
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
}).then(() => {
    console.log("MongoDB connected!");
})
.catch(err => console.log(err));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

//Passport middleware
app.use(passport.initialize());

//  Passport config
import Passport from './configs/passport';

Passport(passport);

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Welcome to my website'
    })
});

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const createLog = (req, res, next) => {
    let error  = new Error("Not found");
    error.status = 404;
    next(error);
}

app.use(createLog);

const handleLog = (error, req, res, next) => {
    return res.status(error.status || 500).json({message: error.message});
}

app.use(handleLog);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});