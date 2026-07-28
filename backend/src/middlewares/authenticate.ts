import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

/**
 * Extends the standard Express Request interface 
 * to attach verified user data onto req.user.
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const requireAuthAPI = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. EXTRACT TOKEN: Try reading from HTTP-only cookie first, fallback to Bearer header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. CHECK IF TOKEN EXISTS
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Authentication required.', 
        redirectTo: '/login' 
      });
      return;
    }

    // 3. READ ENV SECRET: Aligned with JWT_SIGNATURE from the login controller
    const secret = process.env.JWT_SIGNATURE;

    if (!secret) {
      throw new Error('JWT_SIGNATURE is missing from environment variables.');
    }

    // 4. VERIFY TOKEN: Throws an error automatically if expired or tampered with
    const decoded = jwt.verify(token, secret);

    // 5. ATTACH PAYLOAD: Make user details available to downstream route handlers
    req.user = decoded;

    // 6. PROCEED: Hand off control to the next handler/middleware
    next();
  } catch (error: unknown) {
    // 7. ERROR HANDLING & SPECIFIC JWT FAILURE CATCHING
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false,
        message: 'Session expired. Please log in again.', 
        redirectTo: '/login' 
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid or corrupted token.', 
        redirectTo: '/login' 
      });
      return;
    }

    // Server/Configuration errors
    console.error('Middleware Verification Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during authentication.' 
    });
  }
};