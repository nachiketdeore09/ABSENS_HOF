import connectDB from './db/index.js';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: './env' });

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to database, ', error);
    });
