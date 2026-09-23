import { Request, Response } from 'express';
import {
  registerCustomer,
  loginUser,
  updateUserProfile,
  changeUserPassword,
  requestPasswordReset,
  resetPasswordWithToken,
} from '../services/authService';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function parseBody(req: Request): any {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export async function registerCustomerHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const body = parseBody(req);
    const { name, email, phone, password, confirmPassword, address, city, area, landmark } = body;
    const { user, token } = await registerCustomer({
      name,
      email,
      phone,
      password,
      confirmPassword,
      address,
      city,
      area,
      landmark,
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: { user, token },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Registration failed.',
    });
  }
}

export async function loginCustomerHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const body = parseBody(req);
    const { email, password } = body;
    const { user, token } = await loginUser(email, password);

    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: { user, token },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Invalid email or password.',
    });
  }
}

export async function loginAdminHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const body = parseBody(req);
    const { email, password } = body;
    const { user, token } = await loginUser(email, password, 'admin');

    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      success: true,
      message: 'Administrator authenticated successfully.',
      data: { user, token },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Invalid administrator credentials.',
    });
  }
}

export async function logoutHandler(_req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function getProfileHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated.',
    });
  }

  res.json({
    success: true,
    data: req.user,
  });
}

export async function updateProfileHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated.',
      });
    }

    const userId = req.user.id || (req.user as any)._id?.toString();
    const body = parseBody(req);
    const updated = await updateUserProfile(userId, body);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update profile.',
    });
  }
}

export async function changePasswordHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated.',
      });
    }

    const body = parseBody(req);
    const { currentPassword, newPassword, confirmPassword } = body;
    const userId = req.user.id || (req.user as any)._id?.toString();

    await changeUserPassword(userId, currentPassword, newPassword, confirmPassword);

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to change password.',
    });
  }
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const body = parseBody(req);
    const email = body.email;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'A valid email address is required.',
      });
    }

    const result = await requestPasswordReset(email);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('[forgotPasswordHandler error]:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to process password reset request.',
    });
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const body = parseBody(req);
    const { token, newPassword, confirmPassword } = body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Reset token is required.',
      });
    }

    await resetPasswordWithToken(token, newPassword, confirmPassword);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You may now log in with your new password.',
    });
  } catch (error: any) {
    console.error('[resetPasswordHandler error]:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to reset password.',
    });
  }
}
