import React from 'react';
import { Heart, AlertCircle, Scale } from 'lucide-react';
import { Dog } from '../../types';
import { calculateDogMetrics } from '../../utils/dogCalculations';

interface DogHealthCardProps {
  dog: Dog;
}

const DogHealthCard: React.FC<DogHealthCardProps> = ({ dog }) => {
  const metrics = calculateDogMetrics(dog);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-6 h-6 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Health & Care
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <Scale className="w-5 h-5 text-red-500 mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Daily Calories</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {metrics.dailyCalories} kcal
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-red-500 mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Health Status</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {dog.health_conditions?.length ? 'Needs Attention' : 'Healthy'}
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Health Conditions
          </h4>
          {dog.health_conditions?.length ? (
            <div className="space-y-2">
              {dog.health_conditions.map((condition, index) => (
                <div
                  key={index}
                  className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg px-3 py-2 text-sm"
                >
                  {condition}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No health conditions reported
            </p>
          )}
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Dietary Requirements
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Protein</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {metrics.protein}g/day
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Food Amount</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {metrics.foodAmount}g/day
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogHealthCard;