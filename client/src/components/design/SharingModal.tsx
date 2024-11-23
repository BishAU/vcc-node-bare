import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignProject } from '../../types/design';

interface SharingModalProps {
    project: DesignProject;
    isOpen: boolean;
    onClose: () => void;
    onUpdateSharing: (sharing: DesignProject['sharing']) => void;
}

export const SharingModal: React.FC<SharingModalProps> = ({
    project,
    isOpen,
    onClose,
    onUpdateSharing,
}) => {
    const [sharing, setSharing] = React.useState(project.sharing);
    const [copySuccess, setCopySuccess] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const shareUrl = `${window.location.origin}/design/${project.id}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleAddUser = () => {
        if (email && !sharing.sharedWith.includes(email)) {
            setSharing(prev => ({
                ...prev,
                sharedWith: [...prev.sharedWith, email],
            }));
            setEmail('');
        }
    };

    const handleRemoveUser = (userEmail: string) => {
        setSharing(prev => ({
            ...prev,
            sharedWith: prev.sharedWith.filter(email => email !== userEmail),
        }));
    };

    const handleSave = () => {
        onUpdateSharing(sharing);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-25"
                            onClick={onClose}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-10"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">
                                        Share Design
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={sharing.isPublic}
                                            onChange={e =>
                                                setSharing(prev => ({
                                                    ...prev,
                                                    isPublic: e.target.checked,
                                                }))
                                            }
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm">
                                            Make design public
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={sharing.allowComments}
                                            onChange={e =>
                                                setSharing(prev => ({
                                                    ...prev,
                                                    allowComments:
                                                        e.target.checked,
                                                }))
                                            }
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm">
                                            Allow comments
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={sharing.allowDuplication}
                                            onChange={e =>
                                                setSharing(prev => ({
                                                    ...prev,
                                                    allowDuplication:
                                                        e.target.checked,
                                                }))
                                            }
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm">
                                            Allow duplication
                                        </span>
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Share with specific people
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Enter email address"
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <button
                                            onClick={handleAddUser}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        {sharing.sharedWith.map(userEmail => (
                                            <div
                                                key={userEmail}
                                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                                            >
                                                <span className="text-sm">
                                                    {userEmail}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveUser(userEmail)
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Share link
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={shareUrl}
                                            className="flex-1 rounded-md border-gray-300 bg-gray-50"
                                        />
                                        <button
                                            onClick={handleCopyLink}
                                            className={`px-4 py-2 rounded-md ${
                                                copySuccess
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-600 hover:bg-gray-700'
                                            } text-white`}
                                        >
                                            {copySuccess ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};
