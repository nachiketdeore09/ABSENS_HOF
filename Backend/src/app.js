import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
// import session from 'express-session';

const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET, // Change this for security
//         resave: false,
//         saveUninitialized: true,
//         cookie: { maxAge: 30 * 60 * 1000 }, // Session lasts 30 mins
//     }),
// );

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/v1/user', userRouter);


export default app;
