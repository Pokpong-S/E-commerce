import express from 'express';
import { getProfile, Login, Request2be, SignUp } from '../controllers/user_controller.js';
const router = express.Router();
import { authenticate } from '../middleware/authMid.js';


router.post('/signup',SignUp);
router.post('/login',Login);
router.post('/request',authenticate,Request2be);
router.get('/profile',authenticate,getProfile);

export default router;