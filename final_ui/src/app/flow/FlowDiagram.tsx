import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  StickyNote, 
  PenTool,
  ArrowRight,
  ArrowDown,
  Sparkles,
  BookOpen,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  delay: number;
}

const flowSteps: FlowStep[] = [
  {
    id: 'sources',
    title: 'Sources',
    description: 'Upload and organize your research documents, papers, and references',
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    delay: 0
  },
  {
    id: 'chat',
    title: 'Chat',
    description: 'Ask questions and get AI-powered insights from your sources',
    icon: MessageSquare,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    delay: 0.2
  },
  {
    id: 'notes',
    title: 'Notes',
    description: 'Curate and organize key insights, quotes, and findings',
    icon: StickyNote,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    delay: 0.4
  },
  {
    id: 'writer',
    title: 'Writer',
    description: 'Draft your document with AI assistance, citations, and verification',
    icon: PenTool,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    delay: 0.6
  }
];

const FlowStepCard: React.FC<{ step: FlowStep; index: number }> = ({ step, index }) => {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: step.delay,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="relative"
    >
      <div className={`p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 ${step.bgColor} hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-xl ${step.bgColor} border border-gray-200/60 dark:border-gray-700/60`}>
            <Icon size={24} className={step.color} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Step {index + 1}</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Core Panel</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {step.description}
        </p>
        
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${step.color.replace('text-', 'bg-')}`}></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
        </div>
      </div>
    </motion.div>
  );
};

const ArrowConnector: React.FC<{ direction: 'right' | 'down'; delay: number }> = ({ direction, delay }) => {
  const ArrowIcon = direction === 'right' ? ArrowRight : ArrowDown;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: delay,
        ease: "easeOut"
      }}
      className={`flex items-center justify-center ${
        direction === 'right' ? 'w-8 h-8' : 'w-8 h-8'
      }`}
    >
      <div className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
        <ArrowIcon size={16} className="text-gray-600 dark:text-gray-400" />
      </div>
    </motion.div>
  );
};

const FeatureHighlight: React.FC<{ 
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  delay: number;
}> = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ 
      duration: 0.5, 
      delay: delay,
      ease: "easeOut"
    }}
    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60"
  >
    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <Icon size={16} className="text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      <p className="text-xs text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </motion.div>
);

export const FlowDiagram: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AskEden Notebook Writer
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A powerful four-panel workspace that transforms your research into polished documents. 
            Upload sources, chat with AI, organize notes, and write with confidence.
          </p>
        </motion.div>

        {/* Main Flow */}
        <div className="max-w-6xl mx-auto mb-16">
          {/* Desktop Flow */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-8 items-center">
              {flowSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <FlowStepCard step={step} index={index} />
                  {index < flowSteps.length - 1 && (
                    <ArrowConnector direction="right" delay={step.delay + 0.3} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="lg:hidden space-y-8">
            {flowSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <FlowStepCard step={step} index={index} />
                {index < flowSteps.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowConnector direction="down" delay={step.delay + 0.3} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureHighlight
              icon={CheckCircle}
              title="Citation Verification"
              description="Automatic verification of citations and claims with confidence scoring"
              delay={0.9}
            />
            <FeatureHighlight
              icon={BookOpen}
              title="Smart Source Management"
              description="Organize and search through your research documents with AI-powered insights"
              delay={1.0}
            />
            <FeatureHighlight
              icon={Lightbulb}
              title="AI-Powered Writing"
              description="Get intelligent suggestions, auto-formatting, and content refinement"
              delay={1.1}
            />
            <FeatureHighlight
              icon={PenTool}
              title="Professional Export"
              description="Export to Markdown, DOCX, and other formats with proper formatting"
              delay={1.2}
            />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-center mt-16"
        >
          <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Research?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start using the Notebook Writer to create professional documents from your research sources.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Open Workspace
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlowDiagram;
