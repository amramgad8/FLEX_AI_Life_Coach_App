import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import TypewriterText from './TypewriterText';

interface ChatMessageProps {
  content: string;
  type: 'question' | 'answer';
  useTypewriter?: boolean;
}

const ChatMessage = ({ content, type, useTypewriter = true }: ChatMessageProps) => {
  if (!content) {
    return null; // Don't render anything if content is empty
  }
  
  // For answer messages, we don't use typewriter effect
  if (type === 'answer' || !useTypewriter) {
    // Convert line breaks to <br> tags for better formatting
    const formattedContent = content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex ${type === 'answer' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`
          flex items-start max-w-[80%] rounded-2xl p-4
          ${type === 'answer' 
            ? 'bg-flex-green text-white rounded-br-none ml-auto shadow-md' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
          }
        `}>
          {type === 'question' && (
            <Bot className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-flex-green" />
          )}
          {type === 'answer' && (
            <User className="h-5 w-5 ml-2 mt-0.5 shrink-0 order-2 text-white" />
          )}
          <div className={`text-sm ${type === 'answer' ? 'order-1 mr-2' : 'ml-2'}`}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // For question messages, we use typewriter effect
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex justify-start mb-4`}
    >
      <div className="flex items-start max-w-[80%] rounded-2xl p-4 bg-gray-100 text-gray-800 rounded-bl-none shadow-sm">
        <Bot className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-flex-green" />
        <div className="text-sm ml-2">
          <TypewriterText text={content} speed={15} />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;