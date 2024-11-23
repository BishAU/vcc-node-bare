import React, { useState } from 'react';
import DataTable from '../components/DataTable';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: 'active' | 'inactive';
  lastSync: string;
}

interface ABSConfig {
  apiEndpoint: string;
  apiKey: string;
  syncInterval: number;
  lastSync: string | null;
}

const mockEmployees: Employee[] = [
  {
    id: 'E001',
    name: 'John Doe',
    position: 'Software Engineer',
    department: 'Engineering',
    status: 'active',
    lastSync: '2024-01-20'
  },
  {
    id: 'E002',
    name: 'Jane Smith',
    position: 'HR Manager',
    department: 'Human Resources',
    status: 'active',
    lastSync: '2024-01-19'
  },
  // Add more mock employees
];

const defaultConfig: ABSConfig = {
  apiEndpoint: 'https://api.abs.gov.au/v1',
  apiKey: '',
  syncInterval: 24,
  lastSync: null
};

const ABS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'config'>('employees');
  const [config, setConfig] = useState<ABSConfig>(defaultConfig);

  const employeeColumns = [
    { key: 'id' as keyof Employee, header: 'Employee ID' },
    { key: 'name' as keyof Employee, header: 'Name' },
    { key: 'position' as keyof Employee, header: 'Position' },
    { key: 'department' as keyof Employee, header: 'Department' },
    {
      key: 'status' as keyof Employee,
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
    { key: 'lastSync' as keyof Employee, header: 'Last Sync' }
  ];

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement API config update
    console.log('Updating ABS API configuration:', config);
  };

  const handleSync = () => {
    // Implement sync with ABS API
    console.log('Syncing with ABS API...');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">ABS Integration</h1>
          {activeTab === 'employees' && (
            <button
              onClick={handleSync}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sync Now
            </button>
          )}
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'employees'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'config'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              API Configuration
            </button>
          </nav>
        </div>

        {activeTab === 'employees' ? (
          <DataTable
            data={mockEmployees}
            columns={employeeColumns}
            itemsPerPage={10}
          />
        ) : (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleConfigSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-700">
                      API Endpoint
                    </label>
                    <input
                      type="text"
                      id="apiEndpoint"
                      value={config.apiEndpoint}
                      onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <input
                      type="password"
                      id="apiKey"
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="syncInterval" className="block text-sm font-medium text-gray-700">
                      Sync Interval (hours)
                    </label>
                    <input
                      type="number"
                      id="syncInterval"
                      value={config.syncInterval}
                      onChange={(e) => setConfig({ ...config, syncInterval: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ABS;
