import express from 'express';
import { signup , signin, googleAuth} from '../controllers/auth.js';

const router = express.Router();

// @route http://localhost:5000/auth

//Create a new user
router.post("/signup",signup)

//Sign in a user
router.post("/signin", signin)

//Google Auth
router.post("/google",googleAuth)

export default router;