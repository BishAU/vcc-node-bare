import React from 'react';
import { motion } from 'framer-motion';
import { DesignProject, DesignGeneration } from '../../types/design';

interface DesignPreviewProps {
    project: DesignProject;
    generation: DesignGeneration | null;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({ project, generation }) => {
    const renderStatus = () => {
        if (!generation) return null;

        switch (generation.status) {
            case 'queued':
                return (
                    <div className="flex items-center space-x-2">
                        <div className="animate-pulse w-4 h-4 bg-yellow-400 rounded-full" />
                        <span>Queued</span>
                    </div>
                );
            case 'processing':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full" />
                            <span>Generating Design...</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${generation.progress}%` }}
                            />
                        </div>
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center space-x-2 text-green-600">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span>Design Generated</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center space-x-2 text-red-600">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span>Generation Failed</span>
                        {generation.error && (
                            <span className="text-sm text-red-500">
                                ({generation.error})
                            </span>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                {renderStatus()}
            </div>

            {generation?.status === 'completed' && generation.result ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={generation.result.imageUrl}
                            alt={project.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-700">Details</h3>
                            <dl className="mt-2 space-y-1 text-sm text-gray-500">
                                <div>
                                    <dt className="inline font-medium">Vehicle: </dt>
                                    <dd className="inline capitalize">
                                        {project.prompt.vehicleType}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="inline font-medium">Style: </dt>
                                    <dd className="inline capitalize">
                                        {project.prompt.style}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="inline font-medium">Colors: </dt>
                                    <dd className="inline">
                                        <div className="flex items-center space-x-1 mt-1">
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{
                                                    backgroundColor:
                                                        project.prompt.baseColor,
                                                }}
                                            />
                                            {project.prompt.additionalColors?.map(
                                                (color, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{
                                                            backgroundColor: color,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700">
                                Description
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {project.prompt.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <a
                            href={generation.result.imageUrl}
                            download={`${project.name}-design.png`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Download
                        </a>
                        {/* Add more actions as needed */}
                    </div>
                </motion.div>
            ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">
                        Design preview will appear here
                    </span>
                </div>
            )}
        </div>
    );
};
