
import React, { useState, useCallback } from 'react';
import { Message, Role } from './types';
import { sendMessageStream } from './services/geminiService';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: Role.MODEL, content: 'Yo, bestie! Aku Dokbro, temen curhat kesehatanmu. Ada keluhan apa hari ini? Cerita aja, aman! 🩺' }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: Role.USER, content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const stream = await sendMessageStream(userMessage.content);

      let accumulatedText = '';
      setMessages(prev => [...prev, { role: Role.MODEL, content: accumulatedText }]);

      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: Role.MODEL, content: accumulatedText };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = {
        role: Role.MODEL,
        content: 'Waduh, maaf bestie, koneksiku lagi agak ngadat nih. Coba tanya lagi beberapa saat ya. 😅'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full bg-white text-gray-900 font-sans">
      <header className="flex items-center p-3 shadow-md bg-gradient-to-br from-red-600 to-rose-500 text-white">
        <img src="/avatardokter.png" alt="Dokbro Avatar" className="w-11 h-11 rounded-full border-2 border-white/80 shadow-md" />
        <h1 className="text-2xl font-bold tracking-wider ml-4">
          Dokbro AI
        </h1>
      </header>
      <main className="overflow-y-auto py-4 md:py-6">
        <div className="px-4">
          <MessageList messages={messages} />
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="px-4 py-3">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <p className="text-center text-xs text-gray-500 mt-2">
            Ingat, Dokbro bukan pengganti dokter asli ya. Kalau darurat, segera ke faskes terdekat! ✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
