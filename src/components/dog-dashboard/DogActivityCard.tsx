import React from 'react';
import { Activity, Clock, TrendingUp } from 'lucide-react';
import { Dog } from '../../types';
import { calculateDogMetrics } from '../../utils/dogCalculations';

interface DogActivityCardProps {
  dog: Dog;
}

const DogActivityCard: React.FC<DogActivityCardProps> = ({ dog }) => {
  const metrics = calculateDogMetrics(dog);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity & Exercise
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Daily Exercise Goal</span>
            <span>{metrics.feedingSchedule.length} times/day</span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(dog.activity_level / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <Clock className="w-5 h-5 text-blue-500 mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Next Meal</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {metrics.feedingSchedule[0]?.time}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <TrendingUp className="w-5 h-5 text-blue-500 mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">Activity Level</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {dog.activity_level}/10
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Today's Schedule
          </h4>
          <div className="space-y-2">
            {metrics.feedingSchedule.map((meal, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">{meal.time}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {meal.amount}g
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogActivityCard;