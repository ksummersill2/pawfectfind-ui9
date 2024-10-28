import React from 'react';
import { Book, GraduationCap, Brain } from 'lucide-react';
import { Dog } from '../../types';

interface DogGuideCardProps {
  dog: Dog;
}

const DogGuideCard: React.FC<DogGuideCardProps> = ({ dog }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Book className="w-6 h-6 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Training & Guides
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <GraduationCap className="w-5 h-5 text-purple-500 mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Training Level</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              Intermediate
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <Brain className="w-5 h-5 text-purple-500 mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Mental Exercise</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              30 min/day
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Recommended Guides
          </h4>
          <div className="space-y-2">
            <a
              href="#"
              className="block bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {dog.breed} Training Guide
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Essential training tips specific to your breed
              </p>
            </a>
            <a
              href="#"
              className="block bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                Behavior Solutions
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Common behavioral issues and solutions
              </p>
            </a>
            <a
              href="#"
              className="block bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                Exercise Guide
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Age and breed-appropriate exercise routines
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogGuideCard;