import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../../types/user.js';
import { UserRole as PrismaUserRole } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

const mapPrismaRoleToUserRole = (role: PrismaUserRole): UserRole => {
  switch (role) {
    case PrismaUserRole.ADMIN:
      return UserRole.ADMIN;
    default:
      return UserRole.USER;
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: UserRole;
    };
  } catch (error) {
    return null;
  }
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!dbUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user: User = {
      ...dbUser,
      role: mapPrismaRoleToUserRole(dbUser.role)
    };

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requireAuth(req, res, () => {
      if (req.user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(403).json({ error: 'Admin access required' });
  }
};

export const logActivity = async (
  userId: string,
  action: string,
  details?: Record<string, any>
) => {
  try {
    console.log('Activity:', { userId, action, details });
    // TODO: Implement activity logging when database is ready
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
