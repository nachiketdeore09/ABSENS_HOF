import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import sightingRoutes from './routes/sightingRoutes.js';
import missingPersonRoutes from './routes/missingPersonRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
// import session from 'express-session';

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 
 

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
app.use('/api/v1/missing-persons', missingPersonRoutes);
app.use('/api/v1/sightings', sightingRoutes);

app.use(errorHandler);

export default app;
