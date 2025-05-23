import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, isLoading }) => {
  const isUser = role === 'user';

  const customComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold mb-4" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-xl font-bold mb-3" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-lg font-bold mb-2" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-4" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-4" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-4" {...props} />,
    li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    code: ({ node, inline, ...props }: any) => (
      inline ? (
        <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
      ) : (
        <pre className="bg-gray-100 rounded p-4 my-4 overflow-x-auto">
          <code {...props} />
        </pre>
      )
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200'
        )}
      >
        {isLoading ? (
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={customComponents}
            className={cn(
              'prose prose-sm max-w-none',
              isUser ? 'prose-invert' : 'prose-gray'
            )}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;