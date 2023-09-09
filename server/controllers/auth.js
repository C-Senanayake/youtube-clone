import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import {createError} from '../error.js';

const bcryptSalt = bcrypt.genSaltSync(10);

export const signup = async (req, res,next) => {
    const {name , email, password} = req.body;
    const user = await User.findOne({email:email});
    if(user){
        next(createError(400,"User already exists"));
    }else{
        try {
            const user = await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, bcryptSalt)
            })
            res.status(201).json({message:"User created", user});
        } catch (error) {
            next(error);
        }
    }
};

export const signin = async (req,res,next)=>{
    console.log("HIII::",req.body);
    const {email,pass} = req.body;
    const user = await User.findOne({email:email});
    if(user){
        const isCorrect  = bcrypt.compareSync(pass,user.password);
        const {password, ...others} = user._doc;
        if(isCorrect){
            const token = jwt.sign({id:user._id,name:user.name,email:user.email},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
            res.cookie("access_token",token,{
                httpOnly:true
            }).status(200).json({message:"User signed in", others});
            // res.status(200).json({message:"User signed in", user});
        }else{
            next(createError(400,"Incorrect password"));
        }
    }else{
        next(createError(400,"User not found"));
    }
}

export const googleAuth = async (req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(user){
            const {password, ...others} = user._doc;
            const token = jwt.sign({id:user._id,name:user.name,email:user.email},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
            res.cookie("access_token",token,{
                httpOnly:true
            }).status(200).json({message:"User signed in", others});
            // res.status(200).json({message:"User signed in", user});
        }else{
            const newUser = new User({
                ...req.body,
                fromGoogle:true
            })
            const savedUser = await newUser.save();
            const {password, ...others} = savedUser._doc;
            const token = jwt.sign({id:savedUser._id,name:savedUser.name,email:savedUser.email},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
            res.cookie("access_token",token,{
                httpOnly:true
            }).status(200).json({message:"User signed in", others});
        }
    } catch (error) {
        next(error);
    }
}