import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Transaction } from '../lib/types';

interface ChatInterfaceProps {
    transactions: Transaction[];
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ transactions }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const initChat = async () => {
            try {
                const apiKey = import.meta.env.VITE_API_KEY;
                if (!apiKey) throw new Error("API_KEY environment variable not set.");
                
                const ai = new GoogleGenAI({ apiKey });
                
                const initialHistory = [
                    {
                        role: 'user' as const,
                        parts: [{ text: `You are a helpful financial assistant. The following is a JSON object containing a user's bank transaction data. Your task is to answer questions based *only* on this data. Do not make up information. If a question cannot be answered from the data, say so. Be concise and clear. The data is:\n\n${JSON.stringify(transactions, null, 2)}` }]
                    },
                    {
                        role: 'model' as const,
                        parts: [{ text: "Understood. I have your transaction data and am ready to help you analyze it. What would you like to know?" }]
                    }
                ];

                const chatSession = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    history: initialHistory,
                });

                setChat(chatSession);
                setMessages([{ role: 'model', text: "Understood. I have your transaction data and am ready to help you analyze it. What would you like to know?" }]);

            } catch (err: any) {
                setError(`Failed to initialize chat: ${err.message}`);
                console.error(err);
            }
        };

        if (transactions.length > 0) {
            initChat();
        }
    }, [transactions]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
        setError(null);
        
        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (err: any) {
            const errorMessage = `Failed to get response: ${err.message}`;
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error. ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!chat && !error) {
        return (
            <div className="p-4 border rounded-lg text-center bg-gray-100">
                <p className="text-gray-600 font-semibold">Initializing chat assistant...</p>
            </div>
        );
    }

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
                <button type="submit" className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isLoading || !chat || !userInput.trim()}>
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