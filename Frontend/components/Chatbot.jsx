import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaTimes, FaComment } from 'react-icons/fa';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            // Send message to backend
            const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
                message: input
            });

            // Add bot response
            const botMessage = { text: response.data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { text: 'Sorry, there was an error processing your message.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 left-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
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
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors duration-300"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-32">
                                <FaComment size={48} className="mx-auto mb-4 text-blue-200" />
                                <p className="text-lg">How can I help you today?</p>
                                <p className="text-sm mt-2 text-gray-400">Ask me about our services, pricing, or location</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 p-3 rounded-lg ${
                                        message.sender === 'user' 
                                            ? 'bg-blue-500 text-white ml-auto' 
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                    style={{ maxWidth: '80%' }}
                                >
                                    {message.text}
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                        <div className="flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot; 