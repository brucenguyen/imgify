import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { db } from './config/database'
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { imageRouter } from './routes/image';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const API_PORT = (process.env.PORT) ? parseInt(process.env.PORT) : 3001;
const APP_URL = (process.env.CLIENT_URL) ? process.env.CLIENT_URL : "http://localhost:3000";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: [ APP_URL ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use('/image/upload', express.static('uploads'));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/image', imageRouter);

try {
    db.authenticate();
    db.sync();
} catch(err) {
    console.error(err);
}

app.listen(API_PORT, () => {
    console.log(`imgify-api listening on port ${API_PORT}.`);
});
