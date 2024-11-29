import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface RowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  isLoading?: boolean;
  error?: string | null;
  actions?: RowAction<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
}

function DataTable<T>({
  data,
  columns,
  itemsPerPage = 10,
  isLoading = false,
  error = null,
  actions = [],
  onEdit,
  onDelete,
  onToggleStatus
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  // Default actions
  const defaultActions: RowAction<T>[] = [
    ...(onEdit ? [{
      label: 'Edit',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: onEdit
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: onDelete
    }] : []),
    ...(onToggleStatus ? [{
      label: 'Toggle Status',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: onToggleStatus
    }] : []),
    ...actions
  ];

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination logic
  const pageCount = Math.ceil(sortedData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = sortedData.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const requestSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const getCurrentPageData = () => {
    return currentItems;
  };

  const handleSort = (key: keyof T) => {
    requestSort(key);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className="px-6 py-5 text-left text-lg font-bold text-white cursor-pointer hover:text-indigo-300 transition-colors duration-200"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {sortConfig?.key === column.key && (
                          <span className="text-indigo-400">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  {(onEdit || onDelete || onToggleStatus || actions.length > 0) && (
                    <th className="px-6 py-5 text-left text-lg font-bold text-white">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {getCurrentPageData().map((item, index) => (
                  <tr key={index} className="group hover:bg-white/5 transition-colors duration-200">
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-6 py-4">
                        {column.render
                          ? column.render((item as any)[column.key], item)
                          : String((item as any)[column.key])}
                      </td>
                    ))}
                    {(onEdit || onDelete || onToggleStatus || actions.length > 0) && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                          {actions.map((action, actionIndex) => (
                            action.show?.(item) !== false && (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(item)}
                                className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200"
                              >
                                {action.icon || action.label}
                              </button>
                            )
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length > itemsPerPage && (
            <div className="mt-4 flex justify-center">
              <ReactPaginate
                previousLabel={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                }
                nextLabel={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                }
                breakLabel="..."
                pageCount={Math.ceil(data.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={({ selected }) => setCurrentPage(selected)}
                containerClassName="flex items-center gap-2"
                pageClassName="rounded-xl overflow-hidden"
                pageLinkClassName="flex items-center justify-center w-10 h-10 bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                activeClassName="!bg-indigo-500"
                activeLinkClassName="!bg-indigo-500"
                previousClassName="rounded-xl overflow-hidden"
                nextClassName="rounded-xl overflow-hidden"
                previousLinkClassName="flex items-center justify-center w-10 h-10 bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                nextLinkClassName="flex items-center justify-center w-10 h-10 bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                disabledClassName="opacity-50 cursor-not-allowed"
                breakClassName="flex items-center justify-center text-white"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DataTable;
