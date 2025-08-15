import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import User from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader)
      return res.status(401).json({
        message: 'No authentication token, access denied',
        data: null,
      });
    const token = authHeader.replace('Bearer ', '');
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Token is not valid' });

    req.user = user;
    next();
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default protectRoute;
