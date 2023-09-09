import { createError } from "../error.js"
import User from "../models/user.js";
import Video from "../models/video.js";

export const update = async (req,res,next)=>{
    if(req.params.id === req.user.id){
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {new:true}
            );
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error);
        }
    }else{
        return next(createError(403,"You can update only your account"));
    }
}

export const deleteUser = async (req,res,next)=>{
    if(req.params.id === req.user.id){
        try {
            await User.findByIdAndDelete(
                req.params.id
            );
            res.status(200).json("User deleted")
        } catch (error) {
            next(error);
        }
    }else{
        return next(createError(403,"You can delete only your account"));
    }
}

export const getUser = async (req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const subscribe = async (req,res,next)=>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $push:{subscribedUsers: req.params.id},
        });
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:1},
        });
        res.status(200).json("User subscribed");
    } catch (error) {
        next(error);
    }
}

export const unSubscribe = async (req,res,next)=>{
    try {
        await User.findById(req.user.id,{
            $pull:{subscribedUsers: req.params.id},
        });
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers: -1},
        });
        res.status(200).json("User unsubscribed");
    } catch (error) {
        next(error);
    }
}

export const like = async (req,res,next)=>{
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id}, //addToSet is used to add only unique values. If there's duplicate value, it won't be added
            $pull:{dislikes:id} //pull is used to remove the value from the array
        });
        res.status(200).json("Video liked");
    } catch (error) {
        next(error);
    }
}

export const dislike = async (req,res,next)=>{
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes:id}, //addToSet is used to add only unique values. If there's duplicate value, it won't be added
            $pull:{likes:id} //pull is used to remove the value from the array
        });
        res.status(200).json("Video disliked");
    } catch (error) {
        next(error);
    }
}