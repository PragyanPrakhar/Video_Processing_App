import express from 'express';
import { registerUser } from '../controllers/auth/registerUser.js';
import { loginUser } from '../controllers/auth/loginUser.js';
import { logoutUser } from '../controllers/auth/logout.js';
import { getUserProfile } from '../controllers/auth/getProfile.js';
import { isAuthenticated } from '../middlewares/auth.js';
// import { logoutUser } from '../controllers/auth/logoutUser.js';
// import { getUserProfile } from '../controllers/auth/getUserProfile.js';

const router = express.Router();
// Register route
router.post('/register', registerUser);
// Login route
router.post('/login', loginUser);
// Logout route
router.post('/logout',logoutUser);
// fetching user profile route
router.get('/me',isAuthenticated,getUserProfile);
// // Get user profile route
// router.get('/profile', getUserProfile);
// Export the router
export default router;