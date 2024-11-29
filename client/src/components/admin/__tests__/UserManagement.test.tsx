import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserManagement } from '../UserManagement';
import '@testing-library/jest-dom';

const mockUsers = [
    {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        isAdmin: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
        id: '2',
        email: 'admin@example.com',
        name: 'Admin User',
        isAdmin: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    },
];

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = (global.fetch as jest.Mock);

describe('UserManagement Component', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        mockFetch.mockClear();
    });

    it('renders loading state initially', () => {
        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );

        render(
            <QueryClientProvider client={queryClient}>
                <UserManagement />
            </QueryClientProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays user list after loading', async () => {
        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUsers),
            })
        );

        render(
            <QueryClientProvider client={queryClient}>
                <UserManagement />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('Admin User')).toBeInTheDocument();
        });
    });

    it('shows add user form when Add User button is clicked', async () => {
        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUsers),
            })
        );

        render(
            <QueryClientProvider client={queryClient}>
                <UserManagement />
            </QueryClientProvider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByText('Add User'));
        });

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Admin User')).toBeInTheDocument();
    });

    it('handles user creation successfully', async () => {
        const newUser = {
            id: '3',
            email: 'new@example.com',
            name: 'New User',
            isAdmin: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        };

        mockFetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockUsers),
                })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(newUser),
                })
            );

        render(
            <QueryClientProvider client={queryClient}>
                <UserManagement />
            </QueryClientProvider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByText('Add User'));
        });

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'new@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'New User' },
        });

        fireEvent.click(screen.getByText('Create User'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'new@example.com',
                    password: 'password123',
                    name: 'New User',
                    isAdmin: false,
                }),
            });
        });
    });

    it('handles user deletion', async () => {
        mockFetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockUsers),
                })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                })
            );

        render(
            <QueryClientProvider client={queryClient}>
                <UserManagement />
            </QueryClientProvider>
        );

        await waitFor(() => {
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
        });

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/admin/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: '1' }),
            });
        });
    });

    it('handles errors during user operations', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation();

        mockFetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockUsers),
                })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                    statusText: 'Internal Server Error',
                })
            );

        render(
            <QueryClientProvider client={queryClient}>
                <UserManagement />
            </QueryClientProvider>
        );

        await waitFor(() => {
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
        });

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalled();
        });

        consoleError.mockRestore();
    });
});
