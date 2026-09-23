import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, IAuthJWTPayload } from '../types';
import { getUserById } from '../services/authService';

const JWT_SECRET = process.env.JWT_SECRET || 'noor_secret_jwt_key_2026_secure';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Extracts and verifies JWT from cookie or Authorization header.
 * Populates req.user if valid.
 */
export async function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    // 1. Check HTTP-only cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Check Authorization header (Bearer token)
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as IAuthJWTPayload;
    if (decoded && decoded.userId) {
      const user = await getUserById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Expired or invalid token; req.user remains undefined
  }
  next();
}

/**
 * Middleware: Requires any authenticated user (customer or admin)
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in to continue.',
    });
  }
  next();
}

/**
 * Middleware: Requires an authenticated user with role === 'admin'
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden. Administrator privileges required to access this resource.',
    });
  }

  next();
}
