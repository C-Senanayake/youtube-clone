import express from 'express';
import { test } from '../controllers/users.js';

const router = express.Router();

// @route http://localhost:5000/users
router.get("/test",test)

export default router;