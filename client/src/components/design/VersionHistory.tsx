import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import useDesignVersionStore from '../../store/designVersionStore';
import { DesignVersion } from '../../types/design';

interface VersionHistoryProps {
    projectId: string;
    onVersionSelect: (version: DesignVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
    projectId,
    onVersionSelect,
}) => {
    const versions = useDesignVersionStore(state => state.getVersionHistory(projectId));
    const currentVersionId = useDesignVersionStore(state => state.currentVersions[projectId]);
    const compareVersions = useDesignVersionStore(state => state.compareVersions);

    const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);
    const [comparisonResult, setComparisonResult] = React.useState<{
        added: string[];
        removed: string[];
        modified: string[];
    } | null>(null);

    const handleVersionSelect = (version: DesignVersion) => {
        onVersionSelect(version);
    };

    const handleCompareSelect = (versionId: string) => {
        setSelectedVersions(prev => {
            if (prev.includes(versionId)) {
                return prev.filter(id => id !== versionId);
            }
            if (prev.length >= 2) {
                return [prev[1], versionId];
            }
            return [...prev, versionId];
        });
    };

    React.useEffect(() => {
        if (selectedVersions.length === 2) {
            try {
                const result = compareVersions(selectedVersions[0], selectedVersions[1]);
                setComparisonResult(result);
            } catch (error) {
                console.error('Failed to compare versions:', error);
                setComparisonResult(null);
            }
        } else {
            setComparisonResult(null);
        }
    }, [selectedVersions, compareVersions]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Version History</h3>
                {selectedVersions.length > 0 && (
                    <button
                        onClick={() => setSelectedVersions([])}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Clear Selection
                    </button>
                )}
            </div>

            <div className="space-y-2">
                <AnimatePresence>
                    {versions.map((version, index) => (
                        <motion.div
                            key={version.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${
                                version.id === currentVersionId
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            } ${
                                selectedVersions.includes(version.id)
                                    ? 'ring-2 ring-indigo-500'
                                    : ''
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">
                                            Version {versions.length - index}
                                        </span>
                                        {version.id === currentVersionId && (
                                            <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {format(
                                            new Date(version.createdAt),
                                            'MMM d, yyyy h:mm a'
                                        )}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleCompareSelect(version.id)}
                                        className={`px-2 py-1 text-xs rounded-md ${
                                            selectedVersions.includes(version.id)
                                                ? 'bg-indigo-100 text-indigo-800'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                        Compare
                                    </button>
                                    <button
                                        onClick={() => handleVersionSelect(version)}
                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>

                            {version.metadata && (
                                <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium">Model: </span>
                                    {version.metadata.aiModel}
                                    {version.metadata.score && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span className="font-medium">
                                                Score:{' '}
                                            </span>
                                            {version.metadata.score.toFixed(2)}
                                        </>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {comparisonResult && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
                    >
                        <h4 className="text-sm font-medium mb-2">
                            Version Comparison
                        </h4>
                        <div className="space-y-2 text-sm">
                            {comparisonResult.added.length > 0 && (
                                <div>
                                    <span className="text-green-600 font-medium">
                                        Added:
                                    </span>{' '}
                                    {comparisonResult.added.join(', ')}
                                </div>
                            )}
                            {comparisonResult.removed.length > 0 && (
                                <div>
                                    <span className="text-red-600 font-medium">
                                        Removed:
                                    </span>{' '}
                                    {comparisonResult.removed.join(', ')}
                                </div>
                            )}
                            {comparisonResult.modified.length > 0 && (
                                <div>
                                    <span className="text-yellow-600 font-medium">
                                        Modified:
                                    </span>{' '}
                                    {comparisonResult.modified.join(', ')}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
