import { createError } from "../error.js"
import User from "../models/user.js"
import Video from "../models/video.js"

export const addVideo = async (req,res,next)=>{
    console.log("BODY::",req.body);
    const newVideo = new Video({userId: req.user.id,...req.body});
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (error) {
        next(error);
    }
}

export const updateVideo = async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404,"Video not found"));
        if(req.user.id === video.userId){
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {new:true}
            );
            res.status(200).json(updatedVideo);
        }else{
            return next(createError(403,"You can update only your video"));
        }
    } catch (error) {
        next(error);
    }
}

export const deleteVideo = async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404,"Video not found"));
        if(req.user.id === video.userId){
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id);
            res.status(200).json(updatedVideo);
        }else{
            return next(createError(403,"You can delete only your video"));
        }
    } catch (error) {
        next(error);
    }
}

export const getVideo = async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404,"Video not found"));
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
}

export const addView = async (req,res,next)=>{
    console.log("req.params.id::",req.params.id);
    try {
        await Video.findByIdAndUpdate(
            req.params.id,
            {
                $inc:{views:1},
            }
        );
        res.status(200).json("The view has been updated");
    } catch (error) {
        next(error);
    }
}

export const random = async (req,res,next)=>{
    try {
        const videos = await Video.aggregate([{$sample:{size:40}}]); //Gives 40 random videos
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
}

export const trend = async (req,res,next)=>{
    try {
        const videos = await Video.find().sort({views:-1}); //Gives most viewed videos. If put 1, gives least viewed videos.
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
}

export const sub = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        // 'Promise.all()' is used to wait for all the promises in the array to settle 
        // (either resolve with data or reject with an error). When all promises have 
        // settled, Promise.all() returns a new Promise that resolves to an array of 
        // results in the same order as the original promises.
        const list = await Promise.all(
            subscribedChannels.map((channelId)=>{
                return Video.findById({userId: channelId})
            })
        )

        res.status(200).json(list.flat().sort((a,b)=>b.createdAt - a.createdAt));
    } catch (error) {
        next(error);
    }
}

export const getByTag = async (req,res,next)=>{
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({tags:{$in:tags}}).limit(20); //Gives most viewed videos. If put 1, gives least viewed videos.
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
}

export const search = async (req,res,next)=>{
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title:{$regex: query,$options:"i"}, //This is like "LIKE %query%" in SQL, i means case insensitive. When want to check casesensitiveness use "m" instead of "i"
        }).limit(40); 
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
}
