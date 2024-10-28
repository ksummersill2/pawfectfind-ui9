import React, { useState, useMemo } from 'react';
import { Category } from '../../types';
import * as LucideIcons from 'lucide-react';
import { Search } from 'lucide-react';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Category, 'id' | 'created_at' | 'updated_at'>>({
    name: category?.name || '',
    description: category?.description || '',
    icon: category?.icon || 'Package'
  });
  const [iconSearch, setIconSearch] = useState('');

  // Get all available icons
  const allIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(name => 
      typeof (LucideIcons as any)[name] === 'function' && 
      name !== 'createLucideIcon' &&
      name !== 'default'
    );
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    const searchTerm = iconSearch.toLowerCase();
    if (!searchTerm) return allIcons;

    return allIcons.filter(name => 
      name.toLowerCase().includes(searchTerm) ||
      name.replace(/([A-Z])/g, ' $1').toLowerCase().includes(searchTerm)
    );
  }, [allIcons, iconSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      icon: formData.icon || 'Package' // Ensure we always have an icon
    });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Icon
        </label>
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={iconSearch}
              onChange={e => setIconSearch(e.target.value)}
              placeholder="Search icons (e.g., 'tech', 'computer', 'device')..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="grid grid-cols-6 gap-2 h-48 overflow-y-auto p-2 border rounded-lg">
            {filteredIcons.length > 0 ? (
              filteredIcons.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                  className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 ${
                    formData.icon === iconName
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={iconName}
                >
                  {renderIcon(iconName)}
                  <span className="text-xs truncate w-full text-center">
                    {iconName}
                  </span>
                </button>
              ))
            ) : (
              <div className="col-span-6 text-center py-4 text-gray-500">
                <p>No icons found matching "{iconSearch}"</p>
                <p className="text-sm mt-1">Try different keywords or partial terms</p>
              </div>
            )}
          </div>
          {formData.icon && (
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Selected Icon:</span>
              {renderIcon(formData.icon)}
              <span className="text-sm font-medium">{formData.icon}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;