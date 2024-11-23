export const sharedStyles = {
  // Container styles
  pageContainer: 'min-h-screen bg-gray-900 p-8',
  contentWrapper: 'max-w-7xl mx-auto',
  
  // Card styles
  card: 'bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700',
  cardHeader: 'text-2xl font-bold text-white mb-6',
  
  // Text styles
  heading: 'text-3xl font-bold text-white mb-8',
  subheading: 'text-xl font-semibold text-gray-300 mb-4',
  text: 'text-gray-300',
  
  // Badge styles
  badge: {
    base: 'inline-flex px-4 py-2 rounded-xl font-medium shadow-lg',
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
  },
  
  // Status indicator styles
  statusIndicator: {
    base: 'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold shadow-lg',
    active: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    inactive: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    dot: {
      base: 'w-3 h-3 rounded-full',
      active: 'bg-white animate-pulse',
      inactive: 'bg-white/50',
    },
  },
  
  // Form styles
  form: {
    group: 'mb-6',
    label: 'block text-sm font-medium text-gray-300 mb-2',
    input: 'w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    select: 'w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    textarea: 'w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  },
  
  // Button styles
  button: {
    base: 'px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200',
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600',
    ghost: 'bg-gray-700 text-white hover:bg-gray-600',
  },
  
  // Table styles
  table: {
    wrapper: 'overflow-x-auto rounded-xl border border-gray-700',
    base: 'w-full whitespace-nowrap',
    header: 'bg-gray-800 text-left',
    headerCell: 'px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wider',
    row: 'border-t border-gray-700 hover:bg-gray-750',
    cell: 'px-6 py-4 text-sm text-gray-300',
  },
  
  // Value display styles
  value: {
    revenue: 'text-2xl font-black text-emerald-400',
    growth: {
      positive: 'inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg',
      negative: 'inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg',
    },
  },
  
  // Modal styles
  modal: {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm',
    container: 'fixed inset-0 flex items-center justify-center p-4',
    content: 'bg-gray-800 rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto',
    header: 'text-2xl font-bold text-white mb-6',
    body: 'space-y-6',
    footer: 'mt-6 flex justify-end space-x-4',
  },
};

export const combineClasses = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
