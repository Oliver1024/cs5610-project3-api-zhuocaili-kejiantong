if (process.env.NODE_ENV === 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const dbUrl = process.env.DB_URL
// 'mongodb://localhost:27017/job-board'

app.use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(cors({
        origin: 'http://localhost',
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
        credentials: true
    }))

mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true, //make this also true
})
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

app.use('/api/users', userRoutes)
    .use('/api/jobs', jobRoutes);

app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', function (req, res) {
//     console.log("received request");
//     res.sendFile(path.join(__dirname, "build", "index.html"));
//     // res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// 3300
app.listen(80, function () {
    console.log('Starting server at 3300');
});

// const session = require('express-session');
// app.use(session({
//     secret: 'onBoardSpecficAucenticationToken',
//     saveUninitialized: false,
//     resave: false,
//     cookie: { path: 'http://localhost:3000', secure: false },
//     store: MongoStore.create({
//         mongoUrl: 'mongodb://localhost:27017/job-board',
//     })
// }));

// import session from 'express-session'

// export = session

// interface Session {
//     username: string;
// }


// const MongoStore = require('connect-mongo');

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//     next();
// })

