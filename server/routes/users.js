import express from 'express';
import { deleteUser, dislike, getUser, like, subscribe, unSubscribe, update } from '../controllers/users.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

// @route http://localhost:5000/users
router.put("/:id",verifyToken,update);
router.delete("/:id",verifyToken,deleteUser);
router.get("/find/:id",verifyToken,getUser);
router.put("/sub/:id",verifyToken,subscribe);
router.put("/unsub/:id",verifyToken,unSubscribe);
router.put("/like/:videoId",verifyToken,like);
router.put("/dislike/:videoId",verifyToken,dislike);


export default router;