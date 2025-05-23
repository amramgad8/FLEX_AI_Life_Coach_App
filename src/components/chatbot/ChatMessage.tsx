
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
    h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold mb-2 text-gray-800" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-base font-semibold mb-2 text-gray-800" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-3 leading-relaxed" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
    li: ({ node, ...props }: any) => <li className="mb-1 leading-relaxed" {...props} />,
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-300 pl-4 italic my-3 bg-blue-50 py-2 rounded-r" {...props} />
    ),
    code: ({ node, inline, ...props }: any) => (
      inline ? (
        <code className="bg-gray-200 text-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props} />
      ) : (
        <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 my-3 overflow-x-auto">
          <code className="text-sm font-mono" {...props} />
        </pre>
      )
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    strong: ({ node, ...props }: any) => <strong className="font-semibold text-gray-900" {...props} />,
    em: ({ node, ...props }: any) => <em className="italic text-gray-700" {...props} />,
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full border border-gray-300 rounded-lg" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: any) => <thead className="bg-gray-100" {...props} />,
    tbody: ({ node, ...props }: any) => <tbody {...props} />,
    tr: ({ node, ...props }: any) => <tr className="border-b border-gray-200" {...props} />,
    th: ({ node, ...props }: any) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />,
    td: ({ node, ...props }: any) => <td className="border border-gray-300 px-4 py-2" {...props} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-lg p-4 shadow-sm',
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white border border-gray-200 rounded-bl-none'
        )}
      >
        {isLoading ? (
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <div className={cn(
            'prose prose-sm max-w-none',
            isUser ? 'prose-invert text-white' : 'prose-gray'
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={customComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
