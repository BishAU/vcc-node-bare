export const sharedStyles = {
  text: 'text-gray-300',
  heading: 'text-3xl font-bold text-white mb-6',
  subheading: 'text-xl text-gray-300 mb-4',
  pageContainer: 'container mx-auto px-4 py-8',
  contentWrapper: 'max-w-7xl mx-auto',
  card: 'p-6 rounded-xl border border-purple-500/20 bg-purple-900/20',
  cardHeader: 'text-xl font-semibold text-white mb-4',
  value: {
    base: 'text-2xl font-bold text-purple-400',
    revenue: 'text-2xl font-bold text-green-400',
    growth: {
      base: 'text-2xl font-bold',
      positive: 'text-2xl font-bold text-green-400',
      negative: 'text-2xl font-bold text-red-400'
    }
  },
  button: {
    base: 'inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300',
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'border border-purple-500/50 text-purple-300 hover:bg-purple-500/10',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-300 hover:text-white hover:bg-gray-800/50'
  },
  input: {
    base: 'w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500',
    error: 'border-red-500 focus:border-red-500',
  },
  label: 'block text-sm font-medium text-gray-300 mb-1',
  link: {
    base: 'text-purple-400 hover:text-purple-300 transition-colors',
    nav: 'text-gray-300 hover:text-white transition-colors',
  },
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-purple-100 text-purple-800',
    secondary: 'bg-gray-100 text-gray-800'
  },
  table: {
    container: 'min-w-full divide-y divide-gray-700',
    header: 'bg-gray-800',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider',
    row: 'bg-gray-900 hover:bg-gray-800',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-300',
    wrapper: 'overflow-x-auto rounded-lg border border-gray-700',
    base: 'min-w-full divide-y divide-gray-700'
  },
  modal: {
    overlay: 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm',
    container: 'fixed inset-0 z-50 overflow-y-auto',
    content: 'relative bg-gray-800 rounded-lg shadow-xl max-w-lg mx-auto my-8 p-6',
  },
  form: {
    group: 'space-y-1 mb-4',
    error: 'text-sm text-red-500 mt-1',
    label: 'block text-sm font-medium text-gray-300 mb-1',
    input: 'w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500',
    select: 'w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500',
    textarea: 'w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 min-h-[100px] resize-y'
  },
  alert: {
    base: 'p-4 rounded-lg mb-4',
    success: 'bg-green-900/50 text-green-300 border border-green-500/20',
    error: 'bg-red-900/50 text-red-300 border border-red-500/20',
    warning: 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/20',
    info: 'bg-blue-900/50 text-blue-300 border border-blue-500/20',
  },
  loading: {
    spinner: 'animate-spin h-5 w-5 text-white',
    container: 'flex justify-center items-center',
  }
};
