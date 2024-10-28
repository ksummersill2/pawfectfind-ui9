import React, { useState } from 'react';
import { Dog, X, ChevronRight, ChevronLeft } from 'lucide-react';
import DogForm from './DogForm';
import { useDogProfiles } from '../hooks/useDogProfiles';

interface OnboardingFlowProps {
  onClose: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onClose }) => {
  const [step, setStep] = useState<'welcome' | 'add-dog' | 'skip'>('welcome');
  const { addDog } = useDogProfiles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDog = async (dogData: any) => {
    try {
      setIsSubmitting(true);
      await addDog(dogData);
      onClose();
    } catch (error) {
      console.error('Error adding dog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 z-20"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {step === 'welcome' && (
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative h-48 md:h-auto md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80"
                alt="Dog"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 md:w-1/2">
              <div className="mb-6">
                <Dog className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to PawfectFind!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Would you like to add your dog's profile? This helps us personalize product recommendations based on your dog's breed, size, and needs.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setStep('add-dog')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add My Dog
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => setStep('skip')}
                  className="w-full flex items-center justify-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'add-dog' && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Add Your Dog's Profile
            </h2>
            <DogForm
              onSubmit={handleAddDog}
              onCancel={() => setStep('welcome')}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {step === 'skip' && (
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80"
                alt="Dog Products"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-6 md:p-8 md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Problem!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You can still browse all our products and filter them by breed, size, and other characteristics. You can always add your dog's profile later from your account settings.
              </p>

              <button
                onClick={onClose}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Exploring
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;