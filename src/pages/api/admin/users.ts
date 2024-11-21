import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
        case 'GET':
            try {
                const users = await prisma.user.findMany({
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        isAdmin: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });
                res.status(200).json(users);
            } catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ error: 'Failed to fetch users' });
            }
            break;

        case 'POST':
            try {
                const { email, password, name, isAdmin } = req.body;

                // Validate input
                if (!email || !password || !name) {
                    return res.status(400).json({
                        error: 'Email, password, and name are required',
                    });
                }

                // Check if user already exists
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    return res.status(400).json({
                        error: 'User with this email already exists',
                    });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user
                const user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        isAdmin: isAdmin || false,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        isAdmin: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });

                res.status(201).json(user);
            } catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Failed to create user' });
            }
            break;

        case 'PUT':
            try {
                const { id, email, name, isAdmin } = req.body;

                // Validate input
                if (!id || (!email && !name && isAdmin === undefined)) {
                    return res.status(400).json({
                        error: 'User ID and at least one field to update are required',
                    });
                }

                // Update user
                const user = await prisma.user.update({
                    where: { id },
                    data: {
                        ...(email && { email }),
                        ...(name && { name }),
                        ...(isAdmin !== undefined && { isAdmin }),
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        isAdmin: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });

                res.status(200).json(user);
            } catch (error) {
                console.error('Error updating user:', error);
                res.status(500).json({ error: 'Failed to update user' });
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.body;

                if (!id) {
                    return res.status(400).json({
                        error: 'User ID is required',
                    });
                }

                await prisma.user.delete({
                    where: { id },
                });

                res.status(204).end();
            } catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({ error: 'Failed to delete user' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
