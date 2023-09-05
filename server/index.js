import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json({linit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));

//Error handler call by=>next(err)
app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message
    })
})

//Routes
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/videos",videoRoutes)
app.use("/api/comments",commentRoutes)

//Connect mongo
const Mongo_Url = process.env.MONGO_URL;
mongoose.connect(Mongo_Url)
.then(()=>app.listen(PORT, ()=>{console.log("Backend server is running on port " + PORT)}))
.catch((error)=>{console.log(error.message)})
