import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DesignPrompt } from '../../types/design';
import { useDesignStore } from '../../store/designStore';

const vehicleTypes = ['car', 'motorcycle', 'truck', 'van'] as const;
const styles = ['modern', 'vintage', 'racing', 'custom'] as const;

export const DesignForm: React.FC = () => {
    const createProject = useDesignStore(state => state.createProject);
    const generateDesign = useDesignStore(state => state.generateDesign);

    const [formData, setFormData] = useState<DesignPrompt>({
        vehicleType: 'car',
        baseColor: '#000000',
        style: 'modern',
        description: '',
        additionalColors: [],
    });

    const [projectName, setProjectName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        setIsSubmitting(true);
        try {
            const project = await createProject(projectName, formData);
            await generateDesign(project.id);
        } catch (error) {
            console.error('Failed to create design:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleColorAdd = () => {
        if (!formData.additionalColors) {
            setFormData(prev => ({ ...prev, additionalColors: [] }));
        }
        setFormData(prev => ({
            ...prev,
            additionalColors: [...(prev.additionalColors || []), '#000000'],
        }));
    };

    const handleColorRemove = (index: number) => {
        setFormData(prev => ({
            ...prev,
            additionalColors: prev.additionalColors?.filter((_, i) => i !== index),
        }));
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
            onSubmit={handleSubmit}
        >
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Project Name
                </label>
                <input
                    type="text"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                </label>
                <select
                    value={formData.vehicleType}
                    onChange={e => setFormData(prev => ({ ...prev, vehicleType: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {vehicleTypes.map(type => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Base Color
                </label>
                <input
                    type="color"
                    value={formData.baseColor}
                    onChange={e => setFormData(prev => ({ ...prev, baseColor: e.target.value }))}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Style
                </label>
                <select
                    value={formData.style}
                    onChange={e => setFormData(prev => ({ ...prev, style: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {styles.map(style => (
                        <option key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={4}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Additional Colors
                </label>
                <div className="space-y-2">
                    {formData.additionalColors?.map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="color"
                                value={color}
                                onChange={e => {
                                    const newColors = [...(formData.additionalColors || [])];
                                    newColors[index] = e.target.value;
                                    setFormData(prev => ({ ...prev, additionalColors: newColors }));
                                }}
                                className="h-8 w-16 rounded-md border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => handleColorRemove(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleColorAdd}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        Add Color
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Reference Image URL (Optional)
                </label>
                <input
                    type="url"
                    value={formData.reference || ''}
                    onChange={e => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="flex justify-end">
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white ${
                        isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                    {isSubmitting ? 'Creating Design...' : 'Create Design'}
                </motion.button>
            </div>
        </motion.form>
    );
};
