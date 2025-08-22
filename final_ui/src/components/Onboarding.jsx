import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare, FileText, Folder, MemoryStick, Settings, Sparkles, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function Onboarding({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightPosition, setSpotlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Eden AI',
      subtitle: 'Your intelligent AI assistant for high-stakes work',
      description: 'Eden combines the world\'s most advanced AI models with intelligent routing and verification to give you trusted, accurate responses.',
      icon: Sparkles,
      action: 'Get Started',
      spotlight: null
    },
    {
      id: 'chat',
      title: 'AI Conversations',
      subtitle: 'Start chatting with multiple AI models',
      description: 'Type your questions and Eden will automatically route them to the best AI model for your specific task.',
      icon: MessageSquare,
      action: 'Try Chat',
      spotlight: 'chat-input'
    },
    {
      id: 'files',
      title: 'Document Management',
      subtitle: 'Upload and analyze files',
      description: 'Upload documents, images, or code files for AI analysis and processing.',
      icon: FileText,
      action: 'Explore Files',
      spotlight: 'files-section'
    },
    {
      id: 'projects',
      title: 'Project Organization',
      subtitle: 'Organize your work',
      description: 'Create projects to group related conversations and files together.',
      icon: Folder,
      action: 'Create Project',
      spotlight: 'projects-section'
    },
    {
      id: 'memory',
      title: 'Memory & Retrieval',
      subtitle: 'AI that remembers',
      description: 'Eden remembers your past conversations and can retrieve relevant information when needed.',
      icon: MemoryStick,
      action: 'View Memory',
      spotlight: 'memory-section'
    },
    {
      id: 'settings',
      title: 'Customize Your Experience',
      subtitle: 'Personalize Eden to your needs',
      description: 'Configure AI models, set preferences, and customize the interface to match your workflow.',
      icon: Settings,
      action: 'Open Settings',
      spotlight: 'settings-button'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      subtitle: 'Ready to start using Eden',
      description: 'You now have everything you need to get the most out of Eden AI. Start exploring and discover what\'s possible!',
      icon: CheckCircle,
      action: 'Start Using Eden',
      spotlight: null
    }
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isOpen && currentStepData.spotlight) {
      setTimeout(() => {
        highlightElement(currentStepData.spotlight);
      }, 300);
    }
  }, [currentStep, isOpen]);

  const highlightElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setSpotlightPosition({
        top: rect.top - 10,
        left: rect.left - 10,
        width: rect.width + 20,
        height: rect.height + 20
      });
      setShowSpotlight(true);
    }
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleAction = () => {
    switch (currentStepData.id) {
      case 'chat':
        // Navigate to chat
        break;
      case 'files':
        // Navigate to files
        break;
      case 'projects':
        // Navigate to projects
        break;
      case 'memory':
        // Navigate to memory
        break;
      case 'settings':
        // Navigate to settings
        break;
      default:
        handleNext();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="onboarding-overlay" onClick={onClose}>
        <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm" />
      </div>

      {/* Spotlight */}
      {showSpotlight && currentStepData.spotlight && (
        <div 
          className="onboarding-spotlight"
          style={{
            top: spotlightPosition.top,
            left: spotlightPosition.left,
            width: spotlightPosition.width,
            height: spotlightPosition.height,
          }}
        />
      )}

      {/* Onboarding Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full animate-bounce-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <currentStepData.icon size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Progress Steps */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentStep
                        ? 'bg-accent scale-125'
                        : completedSteps.has(index)
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleAction}
              className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-lg hover:bg-accent/90 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {currentStepData.action}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentStep + 1} of {steps.length}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Quick Tips Component
export function QuickTips({ tips, isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-slide-in-up">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Tip</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {tips[Math.floor(Math.random() * tips.length)]}
        </p>
      </div>
    </div>
  );
}

// Feature Highlight Component
export function FeatureHighlight({ feature, isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full animate-bounce-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <feature.icon size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.subtitle}
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {feature.description}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Maybe Later
            </button>
            <button
              onClick={feature.action}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200"
            >
              Try Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 