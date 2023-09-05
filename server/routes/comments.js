import express from 'express';
import {verifyToken} from '../verifyToken.js';
import { addComment, deleteComment, getComments } from '../controllers/comments.js';

const router = express.Router();

// @route http://localhost:5000/cpmments
router.get("/",verifyToken,addComment);
router.delete("/:id",verifyToken,deleteComment);
router.get("/:videoId",getComments);

export default router;