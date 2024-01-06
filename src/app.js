import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
// getting json data
app.use(express.json({
    limit : "16kb"
}))
// used for getting data from url and extended true means getting nested object true 
app.use(express.urlencoded({extended:true, limit : '16kb'}))
// to store data from public assist 
app.use(express.static("public"))
app.use(cookieParser())


// Route Import
import userRouter from './routes/user.routes.js'

// Route declaration
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register


export { app }