import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import DataTable from '../components/DataTable';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '2024-01-19'
  },
  // Add more mock users as needed
];

const Admin: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);

  const columns = [
    { key: 'name' as keyof User, header: 'Name' },
    { key: 'email' as keyof User, header: 'Email' },
    { key: 'role' as keyof User, header: 'Role' },
    {
      key: 'status' as keyof User,
      header: 'Status',
      render: (value: string) => (
        <span
          className={combineClasses(
            'px-3 py-1 text-xs font-medium rounded-full',
            value === 'active'
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'
          )}
        >
          {value}
        </span>
      ),
    },
    { key: 'lastLogin' as keyof User, header: 'Last Login' },
    {
      key: 'id' as keyof User,
      header: 'Actions',
      render: (_: string, user: User) => (
        <div className="flex space-x-4">
          <button
            onClick={() => handleEdit(user)}
            className={combineClasses(
              sharedStyles.button.icon,
              'text-blue-400 hover:text-blue-300'
            )}
          >
            <FiEdit2 className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </button>
          <button
            onClick={() => handleDelete(user)}
            className={combineClasses(
              sharedStyles.button.icon,
              'text-red-400 hover:text-red-300'
            )}
          >
            <FiTrash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
    // Implement edit functionality
  };

  const handleDelete = (user: User) => {
    console.log('Delete user:', user);
    // Implement delete functionality
  };

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.card}>
          <div className="flex justify-between items-center mb-6">
            <h1 className={sharedStyles.heading}>User Management</h1>
            <button
              className={combineClasses(
                sharedStyles.button.base,
                sharedStyles.button.primary,
                'inline-flex items-center'
              )}
              onClick={() => console.log('Add new user')}
            >
              <FiUserPlus className="mr-2" />
              Add User
            </button>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <DataTable
              data={users}
              columns={columns}
              className="min-w-full divide-y divide-gray-700"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Admin;
