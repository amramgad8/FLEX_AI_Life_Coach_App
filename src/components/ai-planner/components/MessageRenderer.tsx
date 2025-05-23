
import React from 'react';
import ChatMessage from '../ChatMessage';
import ChatPlanCard from '../ChatPlanCard';

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
  if (message.type === 'plan' && message.plan) {
    return (
      <div key={index} className="mb-4 font-sans">
        <ChatMessage content={message.content} type="question" />
        <ChatPlanCard
          key={editingKey}
          plan={message.plan}
          onAddTask={onAddTask}
          onAddAllTasks={onAddAllTasks}
          onModifyPlan={onModifyPlan}
          onSavePlan={onSavePlan}
          expandable
        />
      </div>
    );
  }
  return <ChatMessage key={index} content={message.content} type={message.type} />;
};

export default MessageRenderer;
