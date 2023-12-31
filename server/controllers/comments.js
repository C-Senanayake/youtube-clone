// import User from '../models/user.js';
import Comment from '../models/comment.js';
import Video from '../models/video.js';
import { createError } from '../error.js';

export const addComment = async (req,res,next)=>{
    const newCOmment = new Comment({...req.body,userId:req.user.id});
    try {
        const savedComment = await Comment.save();
        res.status(200).json(savedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req,res,next)=>{
    try {
        const comment = await Comment.findById(req.params.id);
        const video = await Video.findById(req.params.id);
        if(req.user.id === comment.userId || req.user.id=== video.userId){
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("comment deleted");
        }else{
            return next(createError(401,"you can delete only your comment"));
        }
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req,res,next)=>{
    try {
        const comments = await Comment.find({videoId:req.params.videoId});
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}