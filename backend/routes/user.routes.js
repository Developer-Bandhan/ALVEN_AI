import { Router } from 'express';
import { body } from 'express-validator'
import * as userController from '../controllers/user.controller.js'
import * as authMiddlewate from '../middlewares/auth.middleware.js'

const router = Router();


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
], userController.registerUser);

router.post('/verify-otp', userController.verifyOTP);

router.post('/resend-otp', userController.resendOTP)

router.post('/forgot-password', userController.forgotPassword)

router.post('/reset-password', userController.resetPassword)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
], userController.loginUser);

router.get('/profile', authMiddlewate.authUser, userController.profileController);

router.get('/all-users', authMiddlewate.authUser, userController.getAllUser);

router.get('/logout', authMiddlewate.authUser, userController.logoutUser);


export default router;