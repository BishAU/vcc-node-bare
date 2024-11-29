import { createMocks } from 'node-mocks-http';
import { getUsers, createUser, updateUser, deleteUser } from '../admin/users';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

jest.mock('../../../lib/prisma', () => ({
    user: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));

describe('User API Endpoints', () => {
    const mockUsers = [
        {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            isAdmin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/admin/users', () => {
        it('returns list of users for admin', async () => {
            const { req, res } = createMocks({
                method: 'GET',
                session: { user: { isAdmin: true } },
            });

            (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);

            await getUsers(req, res);

            expect(res._getStatusCode()).toBe(200);
            expect(JSON.parse(res._getData())).toEqual(mockUsers);
        });

        it('returns 403 for non-admin users', async () => {
            const { req, res } = createMocks({
                method: 'GET',
                session: { user: { isAdmin: false } },
            });

            await getUsers(req, res);

            expect(res._getStatusCode()).toBe(403);
        });
    });

    describe('POST /api/admin/users', () => {
        it('creates a new user successfully', async () => {
            const newUser = {
                email: 'new@example.com',
                password: 'password123',
                name: 'New User',
                isAdmin: false,
            };

            const { req, res } = createMocks({
                method: 'POST',
                body: newUser,
                session: { user: { isAdmin: true } },
            });

            (prisma.user.create as jest.Mock).mockResolvedValueOnce({
                ...newUser,
                id: '2',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await createUser(req, res);

            expect(res._getStatusCode()).toBe(201);
            expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10);
        });

        it('validates required fields', async () => {
            const { req, res } = createMocks({
                method: 'POST',
                body: {},
                session: { user: { isAdmin: true } },
            });

            await createUser(req, res);

            expect(res._getStatusCode()).toBe(400);
        });
    });

    describe('PUT /api/admin/users', () => {
        it('updates user successfully', async () => {
            const updateData = {
                id: '1',
                name: 'Updated Name',
                isAdmin: true,
            };

            const { req, res } = createMocks({
                method: 'PUT',
                body: updateData,
                session: { user: { isAdmin: true } },
            });

            (prisma.user.update as jest.Mock).mockResolvedValueOnce({
                ...mockUsers[0],
                ...updateData,
            });

            await updateUser(req, res);

            expect(res._getStatusCode()).toBe(200);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: updateData.id },
                data: expect.objectContaining({
                    name: updateData.name,
                    isAdmin: updateData.isAdmin,
                }),
            });
        });

        it('returns 404 for non-existent user', async () => {
            const { req, res } = createMocks({
                method: 'PUT',
                body: { id: 'nonexistent' },
                session: { user: { isAdmin: true } },
            });

            (prisma.user.update as jest.Mock).mockRejectedValueOnce(new Error('Not found'));

            await updateUser(req, res);

            expect(res._getStatusCode()).toBe(404);
        });
    });

    describe('DELETE /api/admin/users', () => {
        it('deletes user successfully', async () => {
            const { req, res } = createMocks({
                method: 'DELETE',
                body: { id: '1' },
                session: { user: { isAdmin: true } },
            });

            (prisma.user.delete as jest.Mock).mockResolvedValueOnce(mockUsers[0]);

            await deleteUser(req, res);

            expect(res._getStatusCode()).toBe(200);
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('returns 404 for non-existent user', async () => {
            const { req, res } = createMocks({
                method: 'DELETE',
                body: { id: 'nonexistent' },
                session: { user: { isAdmin: true } },
            });

            (prisma.user.delete as jest.Mock).mockRejectedValueOnce(new Error('Not found'));

            await deleteUser(req, res);

            expect(res._getStatusCode()).toBe(404);
        });
    });
});
