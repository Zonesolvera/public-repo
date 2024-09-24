import express from "express";
import { PORT, mongoDB } from "./config.js"
import mongoose from "mongoose";
import signupRoute from './routes/signupRoute.js';
import loginRoute from './routes/loginRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));

app.get('/', (req,res) => {
    return res.status(234).send("Landing page");
});

app.use('/auth/signup', signupRoute);
app.use('/auth/login', loginRoute);
app.use('/dashboard', dashboardRoute);

mongoose
    .connect(mongoDB)
    .then(() => {
        console.log('App conected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });