

import React, { useState, useEffect, useRef } from 'react';
import { Transaction } from '@/lib/types';
import { GoogleGenAI, Chat } from '@google/genai';

interface ChatInterfaceProps {
    transactions: Transaction[];
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ transactions }) => {
    const [messages, setMessages] = useState<Message[]>([{ role: 'model', text: "I have your transaction data. What would you like to know?" }]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!import.meta.env.VITE_API_KEY) {
            setError("API key is not configured. Chat is disabled.");
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
            const transactionContext = `Analyze the following bank transactions and answer questions about them. The data is in JSON format:\n\n${JSON.stringify(transactions, null, 2)}`;
            const chatInstance = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: [
                    { role: 'user', parts: [{ text: transactionContext }] },
                    { role: 'model', parts: [{ text: "I have your transaction data. What would you like to know?" }] }
                ]
            });
            setChat(chatInstance);
        } catch (err: unknown) {
            console.error("Chat initialization failed:", err);
            setError("Could not initialize AI chat session.");
        }
    }, [transactions]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await chat.sendMessage({ message: currentInput });
            const modelMessage: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            const errorMessage = `Failed to get response: ${message}`;
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error. ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border border-gray-300 rounded-xl p-4 space-y-4 shadow-inner bg-gray-50">
            <div className="h-80 overflow-y-auto space-y-4 p-3 pr-4 bg-white rounded-md border scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && <i className="fas fa-robot text-primary text-xl mb-1"></i>}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <i className="fas fa-robot text-primary text-xl mb-1"></i>
                        <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                           <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {error && <p className="text-red-600 text-sm px-2">{error}</p>}
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="e.g., What was my total spending?"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                    disabled={isLoading || !chat}
                    aria-label="Chat input"
                />
                <button type="submit" className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isLoading || !userInput.trim() || !chat}>
                    <i className="fas fa-paper-plane"></i>
                    <span className="sr-only">Send Message</span>
                </button>
            </form>
            <div className="text-xs text-center text-gray-500">
                AI can make mistakes. Consider checking important information.
            </div>
        </div>
    );
};

export default ChatInterface;