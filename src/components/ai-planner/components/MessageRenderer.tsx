
import React from 'react';
import ChatMessage from '../ChatMessage';
import InlinePlanCard from './InlinePlanCard';

interface MessageRendererProps {
  message: {
    content: string;
    type: 'question' | 'answer' | 'plan';
    plan?: any;
  };
  index: number;
  editingKey: number;
  onAddTask: (task: any) => void;
  onAddAllTasks: (milestone: any) => void;
  onModifyPlan: () => void;
  onSavePlan: (updatedPlan: any) => void;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  index,
  editingKey,
  onAddTask,
  onAddAllTasks,
  onModifyPlan,
  onSavePlan
}) => {
  console.log('Rendering message:', message);
  
  if (message.type === 'plan' && message.plan) {
    console.log('Rendering plan message with plan data:', message.plan);
    return (
      <div key={index} className="mb-6 font-sans">
        <ChatMessage content="✨ Here's your personalized plan:" type="question" />
        <div className="mt-4">
          <InlinePlanCard
            key={editingKey}
            plan={message.plan}
            onAddTask={onAddTask}
            onAddAllTasks={onAddAllTasks}
            onModifyPlan={onModifyPlan}
            onSavePlan={onSavePlan}
          />
        </div>
      </div>
    );
  }
  
  // For non-plan messages, ensure we only pass valid types to ChatMessage
  const messageType = message.type === 'plan' ? 'question' : message.type;
  return <ChatMessage key={index} content={message.content} type={messageType} />;
};

export default MessageRenderer;
