import React from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

interface WorkflowStep {
  id: string;
  title: string;
  completed: boolean;
  command?: string;
  description?: string;
}

interface WorkflowPanelProps {
  steps: WorkflowStep[];
  setSteps: React.Dispatch<React.SetStateAction<WorkflowStep[]>>;
  onStepComplete: (stepId: string) => void;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ 
  steps, 
  setSteps, 
  onStepComplete 
}) => {
  const [showDescription, setShowDescription] = React.useState(true);

  const handleStepClick = (step: WorkflowStep) => {
    if (!step.completed) {
      onStepComplete(step.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Programming Typing Speed Tester</h2>
      </div>

      {/* Workflow Steps */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="space-y-2">
              <button
                onClick={() => handleStepClick(step)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  step.completed 
                    ? "bg-green-900/20 border border-green-700/30" 
                    : "bg-gray-700/50 border border-gray-600/30 hover:bg-gray-700/70"
                )}
              >
                <div className="flex items-center space-x-3">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    step.completed ? "text-green-300" : "text-gray-300"
                  )}>
                    {step.title}
                  </span>
                </div>
                {step.command && (
                  <div className="mt-2 ml-8">
                    <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {step.command}
                    </code>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Project Description */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="flex items-center justify-between w-full text-left mb-2"
        >
          <span className="text-sm font-medium text-gray-300">About CodeTyper</span>
          {showDescription ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        
        {showDescription && (
          <div className="text-xs text-gray-400 space-y-2">
            <p>
              A modern dark theme typing speed tester optimized for developers. 
              Features real-time feedback, comprehensive statistics tracking, and 
              dual practice modes for random programming symbol sequences.
            </p>
            <p>
              Perfect for improving coding speed and accuracy with programming-specific 
              content including symbols, keywords, and code snippets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
