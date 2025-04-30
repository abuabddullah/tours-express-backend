import express from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me', protect, userController.getMe);
router.patch('/updateMe', protect, userController.updateMe);
router.patch('/updatePassword', protect, userController.updatePassword);

export default router;
