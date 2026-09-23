import { Router } from 'express';
import {
  registerCustomerHandler,
  loginCustomerHandler,
  loginAdminHandler,
  logoutHandler,
  getProfileHandler,
  updateProfileHandler,
  changePasswordHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from '../controllers/authController';
import { authenticateToken, requireAuth } from '../middleware/auth';

const router = Router();

// Public auth endpoints
router.post('/register', registerCustomerHandler);
router.post('/login', loginCustomerHandler);
router.post('/admin-login', loginAdminHandler);
router.post('/logout', logoutHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

// Protected customer account endpoints
router.get('/me', authenticateToken, requireAuth, getProfileHandler);
router.put('/profile', authenticateToken, requireAuth, updateProfileHandler);
router.put('/change-password', authenticateToken, requireAuth, changePasswordHandler);

export default router;
