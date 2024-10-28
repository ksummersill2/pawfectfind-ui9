import React, { useState } from 'react';
import { Dog } from 'lucide-react';
import { Review } from '../types';

interface ReviewFormProps {
  productId: number;
  onSubmit: (review: Omit<Review, 'id' | 'helpful'>) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit, onCancel }) => {
  const [pawRating, setPawRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hoveredPaw, setHoveredPaw] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      productId,
      userId: 'user123', // In a real app, this would come from auth
      userName: 'John Doe', // In a real app, this would come from auth
      pawRating,
      rating: pawRating, // Keep both for backward compatibility
      title,
      content,
      date: new Date().toISOString(),
      verified: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Paw Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((paw) => (
            <button
              key={paw}
              type="button"
              onClick={() => setPawRating(paw)}
              onMouseEnter={() => setHoveredPaw(paw)}
              onMouseLeave={() => setHoveredPaw(null)}
              className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
            >
              <Dog
                className={`w-8 h-8 ${
                  paw <= (hoveredPaw ?? pawRating)
                    ? 'text-blue-500 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Review
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          required
        />
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
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;