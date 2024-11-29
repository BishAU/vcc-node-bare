import React, { useState } from 'react';
import { sharedStyles, combineClasses } from '../../styles/shared';
import Modal from '../Modal';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'other';
  url: string;
  category: string;
  tags: string[];
  uploadDate: string;
  lastModified: string;
  status: 'active' | 'archived' | 'draft';
  fileSize?: number;
  downloadCount: number;
  author: string;
}

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resource: Omit<Resource, 'id' | 'uploadDate' | 'lastModified' | 'downloadCount'>) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Omit<Resource, 'id' | 'uploadDate' | 'lastModified' | 'downloadCount'>>({
    title: '',
    description: '',
    type: 'document',
    url: '',
    category: '',
    tags: [],
    status: 'draft',
    fileSize: undefined,
    author: '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      type: 'document',
      url: '',
      category: '',
      tags: [],
      status: 'draft',
      fileSize: undefined,
      author: '',
    });
    setTagInput('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Resource">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sharedStyles.form.group}>
          <label htmlFor="title" className={sharedStyles.form.label}>
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={sharedStyles.form.input}
            required
          />
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="description" className={sharedStyles.form.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={sharedStyles.form.textarea}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="type" className={sharedStyles.form.label}>
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={sharedStyles.form.select}
              required
            >
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="category" className={sharedStyles.form.label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={sharedStyles.form.select}
              required
            >
              <option value="">Select a category</option>
              <option value="training">Training</option>
              <option value="documentation">Documentation</option>
              <option value="tutorial">Tutorial</option>
              <option value="guide">Guide</option>
              <option value="template">Template</option>
            </select>
          </div>
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="url" className={sharedStyles.form.label}>
            URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className={sharedStyles.form.input}
            placeholder="https://"
            required
          />
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="tags" className={sharedStyles.form.label}>
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 rounded-full flex items-center space-x-1"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-400 hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagKeyPress}
            className={sharedStyles.form.input}
            placeholder="Press Enter to add tags"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="status" className={sharedStyles.form.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={sharedStyles.form.select}
              required
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="fileSize" className={sharedStyles.form.label}>
              File Size (in bytes)
            </label>
            <input
              type="number"
              id="fileSize"
              name="fileSize"
              value={formData.fileSize || ''}
              onChange={handleChange}
              className={sharedStyles.form.input}
              min="0"
            />
          </div>
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="author" className={sharedStyles.form.label}>
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={sharedStyles.form.input}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.ghost)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.primary)}
          >
            Add Resource
          </button>
        </div>
      </form>
    </Modal>
  );
};
