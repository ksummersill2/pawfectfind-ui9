import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Dog, Heart, Tag, Search, ShoppingBag } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const OnboardingWalkthrough: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: "Welcome to PawfectFind",
      description: "Your personalized pet product discovery platform. We help you find the perfect products tailored to your dog's unique needs.",
      icon: <Dog className="w-8 h-8 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Create Your Dog's Profile",
      description: "Add your dog's details like breed, age, and size to get personalized product recommendations that match their specific needs.",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Discover Black Friday Deals",
      description: "Find exclusive discounts on premium pet products during our Black Friday event. Save big on food, toys, and more!",
      icon: <Tag className="w-8 h-8 text-red-500" />,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Smart Search & Filters",
      description: "Easily find products by breed, size, or specific needs. Our advanced filters help you find exactly what your dog needs.",
      icon: <Search className="w-8 h-8 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Start Shopping",
      description: "Ready to find the perfect products for your furry friend? Let's get started!",
      icon: <ShoppingBag className="w-8 h-8 text-green-500" />,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-[95vw] md:max-w-4xl overflow-hidden">
        <div className="relative flex flex-col h-full max-h-[90vh] md:max-h-[80vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 z-20 shadow-lg"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-10">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <div className="relative h-48 md:h-auto md:w-1/2 flex-shrink-0">
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col p-6 md:p-8 md:w-1/2 overflow-y-auto">
              <div className="flex-1">
                <div className="mb-6">
                  {steps[currentStep].icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {steps[currentStep].title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Navigation */}
              <div className="mt-8 space-y-4">
                {/* Progress Dots */}
                <div className="flex justify-center space-x-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-blue-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePrevious}
                    className={`flex items-center px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg transition-colors ${
                      currentStep === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                    Previous
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center px-3 py-2 text-sm md:px-4 md:py-2 md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWalkthrough;