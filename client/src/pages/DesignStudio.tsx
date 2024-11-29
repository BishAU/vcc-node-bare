import React from 'react';
import { motion } from 'framer-motion';
import { DesignForm } from '../components/design/DesignForm';
import { DesignPreview } from '../components/design/DesignPreview';
import { useDesignStore } from '../store/designStore';

const DesignStudio: React.FC = () => {
    const activeProject = useDesignStore(state => state.activeProject);
    const getProjectStatus = useDesignStore(state => state.getProjectStatus);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Design Studio
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Create stunning racing livery designs with AI
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Design Parameters
                        </h2>
                        <DesignForm />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Preview</h2>
                        {activeProject ? (
                            <DesignPreview
                                project={activeProject}
                                generation={getProjectStatus(activeProject.id)}
                            />
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-center text-gray-500">
                                    <svg
                                        className="mx-auto h-12 w-12"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="mt-2">
                                        Fill out the form to generate a design
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export { DesignStudio };
export default DesignStudio;
