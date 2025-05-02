const express = require('express');
const router = express.Router();

// Simple responses for the chatbot
const responses = {
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! How can I assist you?',
    'help': 'I can help you with vehicle service related queries. What would you like to know?',
    'service': 'We offer various vehicle services including maintenance, repairs, and emergency assistance.',
    'price': 'Service prices vary depending on the type of service. Please contact our service center for detailed pricing.',
    'location': 'Our service center is located at [Your Address].',
    'contact': 'You can contact us at [Your Phone Number] or email us at [Your Email].'
};

// Chatbot endpoint
router.post('/chat', (req, res) => {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();
    
    // Find matching response
    let response = "I'm sorry, I don't understand that. Could you please rephrase?";
    
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }
    
    res.json({ response });
});

module.exports = router; 