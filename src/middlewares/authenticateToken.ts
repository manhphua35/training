import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';



export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    console.log(decoded);
    req.user = decoded; // Gán thông tin giải mã của token vào request

    next(); // Chuyển sang middleware tiếp theo hoặc controller
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
