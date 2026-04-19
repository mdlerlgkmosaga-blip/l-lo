/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Bot, User, Send, Loader2 } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
      });

      const botMessage: Message = { role: 'bot', content: response.text || 'No response.' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Sorry, an error occurred.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 p-4 font-sans text-gray-100">
      <header className="py-4 text-center">
        <h1 className="text-2xl font-semibold text-white tracking-tight">AI Chat Companion</h1>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl bg-gray-900 shadow-sm border border-gray-800">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'bot' && <div className="p-2 bg-gray-800 rounded-full"><Bot className="w-5 h-5 text-gray-300" /></div>}
            <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-100 rounded-bl-none'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && <div className="p-2 bg-red-900 rounded-full"><User className="w-5 h-5 text-red-300" /></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-full"><Bot className="w-5 h-5 text-gray-300" /></div>
            <div className="p-3 bg-gray-800 text-gray-400 rounded-2xl italic flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin"/> Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="py-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask something..."
          className="flex-1 p-3 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


