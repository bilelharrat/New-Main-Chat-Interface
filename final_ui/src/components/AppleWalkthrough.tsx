import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  FileText, 
  StickyNote, 
  ArrowUp, 
  Download, 
  Search, 
  Plus,
  Lightbulb,
  Target,
  CheckCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Upload
} from 'lucide-react';

// ============================================================================
// APPLE-STYLED WALKTHROUGH DEMO
// ============================================================================

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
  tip?: string;
  highlightColor?: string;
}

const AppleWalkthrough: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ side: 'right', direction: 'bottom' });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const walkthroughSteps: WalkthroughStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Apple Notebook',
      description: 'Experience the future of note-taking with our elegant, minimalist design inspired by Apple\'s philosophy of simplicity and beauty.',
      icon: BookOpen,
      position: 'center',
      action: 'Let\'s begin your journey'
    },
    {
      id: 'sources-panel',
      title: 'Sources Panel',
      description: 'Your research hub. This panel contains all your uploaded documents, web links, and pasted text. Everything you need to build knowledge is here.',
      icon: FileText,
      position: 'right',
      targetSelector: '[data-walkthrough="sources-panel"]',
      tip: 'This is where all your research materials live'
    },
    {
      id: 'add-sources-button',
      title: 'Add Sources Button',
      description: 'Click this beautiful button to add new sources. You can upload files, add web links, or paste text directly.',
      icon: Plus,
      position: 'right',
      targetSelector: '[data-walkthrough="add-sources-button"]',
      tip: 'Try clicking this button to see the add sources modal'
    },
    {
      id: 'notes-panel',
      title: 'Notes Panel',
      description: 'Organize your thoughts with multiple note sets. Each set can have its own theme and purpose. Perfect for different projects or topics.',
      icon: StickyNote,
      position: 'left',
      targetSelector: '[data-walkthrough="notes-panel"]',
      tip: 'Create different note sets for different topics'
    },
    {
      id: 'chat-interface',
      title: 'AI Chat Interface',
      description: 'Ask questions about your sources, get insights, and have conversations with your research. The AI understands your content.',
      icon: BookOpen,
      position: 'top',
      targetSelector: '[data-walkthrough="chat-interface"]',
      tip: 'Try asking "What are the main points in my sources?"'
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      description: 'Access your most important features instantly. Toggle panels, generate reports, and navigate with ease.',
      icon: Target,
      position: 'top',
      targetSelector: '[data-walkthrough="quick-actions"]',
      tip: 'Use these buttons to quickly access features'
    },
    {
      id: 'upload-button',
      title: 'Upload Documents',
      description: 'Start by uploading documents to get the most out of Apple Notebook. Drag and drop files or click to browse.',
      icon: Upload,
      position: 'top',
      targetSelector: '[data-walkthrough="upload-button"]',
      tip: 'This is your main entry point to start using the notebook'
    },
    {
      id: 'completion',
      title: 'You\'re All Set!',
      description: 'You now know the essentials of Apple Notebook. Start by adding some sources, then begin taking notes and asking questions. Happy researching!',
      icon: CheckCircle,
      position: 'center',
      action: 'Start using Apple Notebook'
    }
  ];

  const currentStepData = walkthroughSteps[currentStep];
  const progress = ((currentStep + 1) / walkthroughSteps.length) * 100;

  // Find and highlight target element
  useEffect(() => {
    if (currentStepData.targetSelector) {
      const element = document.querySelector(currentStepData.targetSelector) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect();
        const tooltipWidth = 380; // Increased width for larger text
        const tooltipHeight = 320; // Increased height for larger text and spacing
        
        let top = rect.top + window.scrollY;
        let left = rect.left + window.scrollX;
        
        // Smart positioning based on available space
        const spaceAbove = rect.top + window.scrollY;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceLeft = rect.left + window.scrollX;
        const spaceRight = window.innerWidth - rect.right;
        
        // Determine best position based on available space
        let preferredPosition = currentStepData.position;
        
        // Override position if there's not enough space
        if (preferredPosition === 'top' && spaceAbove < tooltipHeight + 40) {
          preferredPosition = 'bottom';
        } else if (preferredPosition === 'bottom' && spaceBelow < tooltipHeight + 40) {
          preferredPosition = 'top';
        } else if (preferredPosition === 'left' && spaceLeft < tooltipWidth + 40) {
          preferredPosition = 'right';
        } else if (preferredPosition === 'right' && spaceRight < tooltipWidth + 40) {
          preferredPosition = 'left';
        }
        
        // Position tooltip based on determined position
        switch (preferredPosition) {
          case 'top':
            top = rect.top + window.scrollY - tooltipHeight - 20;
            left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'bottom':
            top = rect.bottom + window.scrollY + 20;
            left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'left':
            top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left + window.scrollX - tooltipWidth - 20;
            break;
          case 'right':
            top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + window.scrollX + 20;
            break;
        }
        
        // Ensure tooltip stays within viewport with better boundary detection
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        // Horizontal positioning
        if (left < 20) left = 20;
        if (left + tooltipWidth > viewportWidth - 20) left = viewportWidth - tooltipWidth - 20;
        
        // Vertical positioning with scroll consideration
        const availableTop = scrollY + 20;
        const availableBottom = scrollY + viewportHeight - 20;
        
        if (top < availableTop) {
          // If tooltip would go above viewport, position it below the element instead
          if (currentStepData.position === 'top') {
            top = rect.bottom + window.scrollY + 20;
          } else {
            top = availableTop;
          }
        }
        
        if (top + tooltipHeight > availableBottom) {
          // If tooltip would go below viewport, position it above the element instead
          if (currentStepData.position === 'bottom') {
            top = rect.top + window.scrollY - tooltipHeight - 20;
          } else {
            top = availableBottom - tooltipHeight;
          }
        }
        
        setTooltipPosition({ top, left });
        
        // Calculate arrow position based on final tooltip position
        const arrowSide = left < rect.left + window.scrollX ? 'right' : 'left';
        const arrowDirection = top < rect.top + window.scrollY ? 'bottom' : 'top';
        setArrowPosition({ side: arrowSide, direction: arrowDirection });
        
        // Add highlight class
        element.classList.add('walkthrough-highlight');
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetElement(null);
    }
    
    // Cleanup previous highlights
    return () => {
      document.querySelectorAll('.walkthrough-highlight').forEach(el => {
        el.classList.remove('walkthrough-highlight');
      });
    };
  }, [currentStep, currentStepData]);

  const nextStep = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const skipWalkthrough = () => {
    onComplete();
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle window resize to recalculate positions
  useEffect(() => {
    const handleResize = () => {
      if (currentStepData.targetSelector && targetElement) {
        // Trigger position recalculation by updating current step
        setCurrentStep(prev => prev);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStepData.targetSelector, targetElement]);

  if (!isOpen) return null;

  // For welcome and completion steps, show centered modal
  if (currentStepData.position === 'center') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center shadow-lg">
                <currentStepData.icon size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Apple Notebook Tour
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {walkthroughSteps.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={skipWalkthrough}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Skip Tour
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-[#007AFF] to-[#0056CC] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-3xl flex items-center justify-center shadow-xl">
                  <currentStepData.icon size={32} className="text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                {currentStepData.title}
              </h3>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6">
                {currentStepData.description}
              </p>

              {/* Action Button */}
              {currentStepData.action && (
                <div className="text-center mb-6">
                  <button 
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    {currentStepData.action}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {walkthroughSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentStep 
                      ? 'bg-[#007AFF] scale-125' 
                      : index < currentStep 
                        ? 'bg-[#007AFF]/60' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <span>{currentStep === walkthroughSteps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For interactive steps, show overlay with tooltip
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Very light overlay without blur */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Interactive Tooltip */}
      {targetElement && (
        <div
          ref={tooltipRef}
          className="absolute z-[101] w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Arrow pointing to target */}
          <div className="absolute w-4 h-4 bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-700/50 transform rotate-45"
               style={{
                 [arrowPosition.side]: '-8px',
                 [arrowPosition.direction]: '20px',
               }}
          />

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-xl flex items-center justify-center shadow-lg">
                <currentStepData.icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {walkthroughSteps.length}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {currentStepData.description}
            </p>

            {/* Tip */}
            {currentStepData.tip && (
              <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] dark:from-[#0D47A1]/20 dark:to-[#1565C0]/20 rounded-xl p-4 border border-[#90CAF9]/30 dark:border-[#1976D2]/30">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-[#1976D2] dark:text-[#64B5F6] font-medium">
                    {currentStepData.tip}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {walkthroughSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentStep 
                      ? 'bg-[#007AFF] scale-125' 
                      : index < currentStep 
                        ? 'bg-[#007AFF]/60' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm"
            >
              <span>{currentStep === walkthroughSteps.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleWalkthrough;
