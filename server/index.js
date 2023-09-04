import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

//Connect mongo
const Mongo_Url = process.env.MONGO_URL;
mongoose.connect(Mongo_Url)
.then(()=>app.listen(PORT, ()=>{console.log("Backend server is running on port " + PORT)}))
.catch((error)=>{console.log(error.message)})
