
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Role } from '../types';
import { UserIcon } from './icons/UserIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? 'flex items-start justify-end' : 'flex items-start justify-start';
  const bubbleClasses = isUser
    ? 'bg-slate-800 text-white'
    : 'bg-gradient-to-br from-red-600 to-rose-500 text-white';

  const handleCopy = () => {
    if (isCopied || !message.content) return;
    navigator.clipboard.writeText(message.content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Revert back to copy icon after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Gagal menyalin teks.');
    });
  };

  return (
    <div className={`${wrapperClasses} animate-fade-in`}>
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
         <div className="flex-shrink-0 mt-1">
            {isUser ? (
              <div className="p-1.5 rounded-full bg-slate-800">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            ) : (
              <img src="/avatardokter.png" alt="Dokbro Avatar" className="w-10 h-10 rounded-full shadow-md" />
            )}
         </div>
         <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-xl ${bubbleClasses} shadow-md max-w-md md:max-w-lg`}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="markdown-content">
                 {message.content ? (
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                     {message.content}
                   </ReactMarkdown>
                 ) : (
                   <span className="inline-block w-2 h-5 bg-white/50 animate-pulse rounded-sm"></span>
                 )}
                </div>
              )}
            </div>
            {!isUser && message.content && (
              <button
                  onClick={handleCopy}
                  className="mt-2 flex items-center gap-1.5 p-1 rounded-md text-xs text-gray-500 bg-gray-100 transition-all duration-200 hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={isCopied ? 'Teks disalin!' : 'Salin teks'}
              >
                  {isCopied ? <CheckIcon className="w-3.5 h-3.5 text-green-600" /> : <ClipboardIcon className="w-3.5 h-3.5" />}
                  <span className="font-medium">{isCopied ? 'Disalin!' : 'Salin'}</span>
              </button>
            )}
         </div>
      </div>
    </div>
  );
};

export default ChatMessage;
