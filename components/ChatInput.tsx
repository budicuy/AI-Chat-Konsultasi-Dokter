
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface ChatInputProps {
  onSendMessage: (input: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ketik keluhanmu di sini..."
        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="w-full bg-gradient-to-br from-red-600 to-rose-500 text-white rounded-lg p-3 h-12 flex items-center justify-center gap-2 transform transition-all duration-300 hover:shadow-lg hover:from-red-700 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
        aria-label="Kirim pesan"
      >
        {isLoading ? (
          <LoadingSpinner className="w-6 h-6"/>
        ) : (
          <>
            <SendIcon className="w-5 h-5" />
            <span className="font-semibold">Kirim</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ChatInput;