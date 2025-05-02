import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaTimes, FaComment, FaRedo, FaHistory } from 'react-icons/fa';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messageHistory, setMessageHistory] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateTyping = async (text) => {
        setIsTyping(true);
        let currentText = '';
        for (let i = 0; i < text.length; i++) {
            currentText += text[i];
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    text: currentText
                };
                return newMessages;
            });
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        setIsTyping(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            // Send message to backend
            const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
                message: input
            });

            // Add bot response with empty text initially
            const botMessage = { text: '', sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
            
            // Simulate typing for bot response
            await simulateTyping(response.data.response);

            // Save to history
            setMessageHistory(prev => [...prev, {
                user: input,
                bot: response.data.response
            }]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { text: 'Sorry, there was an error processing your message.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleReplay = () => {
        setMessages([]);
    };

    const handlePreviousQuestion = (question) => {
        setInput(question);
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 left-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 hover:scale-110"
                >
                    <FaRobot size={24} />
                    <span className="text-sm font-medium">Chat with us</span>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-4 left-4 w-96 bg-white rounded-lg shadow-xl transform transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center">
                            <FaRobot className="mr-2" />
                            <h3 className="text-lg font-semibold">Vehicle Service Assistant</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReplay}
                                className="text-white hover:text-gray-200 transition-colors duration-300"
                                title="Start new conversation"
                            >
                                <FaRedo />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors duration-300"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                    
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-32 animate-fade-in">
                                <FaComment size={48} className="mx-auto mb-4 text-blue-200" />
                                <p className="text-lg">How can I help you today?</p>
                                <p className="text-sm mt-2 text-gray-400">Ask me about our services, pricing, or location</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 p-3 rounded-lg transform transition-all duration-300 ${
                                        message.sender === 'user' 
                                            ? 'bg-blue-500 text-white ml-auto hover:scale-105' 
                                            : 'bg-gray-200 text-gray-800 hover:scale-105'
                                    }`}
                                    style={{ 
                                        width: '80%',
                                        minHeight: '40px',
                                        maxHeight: '200px',
                                        overflow: 'auto'
                                    }}
                                >
                                    {message.text}
                                    {isTyping && index === messages.length - 1 && (
                                        <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-blink" />
                                    )}
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t bg-white">
                        {messageHistory.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2">
                                {messageHistory.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePreviousQuestion(item.user)}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors duration-300"
                                    >
                                        {item.user}
                                    </button>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg transition-colors duration-300 ${
                                    isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                                disabled={isTyping}
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot; 