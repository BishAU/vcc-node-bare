import React, { useState } from 'react';
import DataTable from '../components/DataTable';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
  subscriptions: number;
  lastLogin: string;
}

const mockClients: Client[] = [
  {
    id: 'CLT001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    company: 'Tech Solutions Inc',
    status: 'active',
    subscriptions: 3,
    lastLogin: '2024-01-20'
  },
  {
    id: 'CLT002',
    name: 'Sarah Johnson',
    email: 'sarah.j@innovate.co',
    company: 'Innovate Co',
    status: 'active',
    subscriptions: 1,
    lastLogin: '2024-01-19'
  },
  {
    id: 'CLT003',
    name: 'Michael Brown',
    email: 'm.brown@enterprise.com',
    company: 'Enterprise Systems',
    status: 'inactive',
    subscriptions: 0,
    lastLogin: '2024-01-15'
  }
];

const Clients: React.FC = () => {
  const [clients] = useState<Client[]>(mockClients);

  const columns = [
    { key: 'name' as keyof Client, header: 'Name' },
    { key: 'email' as keyof Client, header: 'Email' },
    { key: 'company' as keyof Client, header: 'Company' },
    {
      key: 'status' as keyof Client,
      header: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      )
    },
    { 
      key: 'subscriptions' as keyof Client, 
      header: 'Subscriptions',
      render: (value: number) => value.toLocaleString()
    },
    { key: 'lastLogin' as keyof Client, header: 'Last Login' },
    {
      key: 'id' as keyof Client,
      header: 'Actions',
      render: (_: string, client: Client) => (
        <div className="flex space-x-2">
          <button
            onClick={() => console.log('Edit client:', client)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => console.log('Delete client:', client)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your client accounts and subscriptions
            </p>
          </div>
          <button
            onClick={() => console.log('Add client')}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Client
          </button>
        </div>

        <DataTable
          data={clients}
          columns={columns}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default Clients;
