const express = require('express');
const router = express.Router();

// Simple responses for the chatbot
const responses = {
    // Greetings
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! How can I assist you?',
    'help': 'I can help you with vehicle service related queries. What would you like to know?',
    
    // Services
    'service': 'We offer various vehicle services including:\n' +
               '1. Regular Maintenance\n' +
               '2. Engine Repairs\n' +
               '3. Brake System Services\n' +
               '4. Transmission Services\n' +
               '5. Electrical System Repairs\n' +
               '6. Emergency Assistance\n' +
               '7. Vehicle Diagnostics\n' +
               '8. Tire Services\n' +
               '9. Oil Changes\n' +
               '10. Battery Services',
    
    // Pricing
    'price': 'Our service prices vary depending on the type of service:\n' +
             '1. Regular Maintenance: Starting from Rs. 5,000\n' +
             '2. Engine Repairs: Starting from Rs. 10,000\n' +
             '3. Brake System: Starting from Rs. 3,000\n' +
             '4. Transmission: Starting from Rs. 15,000\n' +
             '5. Electrical Repairs: Starting from Rs. 2,500\n' +
             '6. Emergency Service: Starting from Rs. 7,500\n' +
             '7. Diagnostics: Rs. 2,000\n' +
             '8. Tire Services: Starting from Rs. 1,500\n' +
             '9. Oil Change: Rs. 3,500\n' +
             '10. Battery Service: Starting from Rs. 2,000\n\n' +
             'For exact pricing, please contact our service center.',
    
    // Location
    'location': 'Our service center is located at:\n' +
                '15 Eramudugaha Junction, Unawatuna\n' +
                'Galle, Sri Lanka\n\n' +
                'We are open from:\n' +
                'Monday to Saturday: 8:00 AM - 6:00 PM\n' +
                'Sunday: 9:00 AM - 1:00 PM',
    
    // Contact
    'contact': 'You can reach us through:\n' +
               'Phone: 0762060052\n' +
               'Email: info@motron.com\n' +
               'WhatsApp: 0762060052\n\n' +
               'For emergency services, call us 24/7.',
    
    // Emergency
    'emergency': 'For emergency services:\n' +
                 '1. Call us immediately at 0762060052\n' +
                 '2. Our emergency team will reach you within 30 minutes\n' +
                 '3. 24/7 service available\n' +
                 '4. Free towing within 10km radius',
    
    // Maintenance
    'maintenance': 'Regular maintenance services include:\n' +
                   '1. Oil and filter change\n' +
                   '2. Brake inspection and service\n' +
                   '3. Tire rotation and balancing\n' +
                   '4. Battery check\n' +
                   '5. Fluid level checks\n' +
                   '6. Air filter replacement\n' +
                   '7. General inspection',
    
    // Booking
    'book': 'To book a service:\n' +
            '1. Call us at 0762060052\n' +
            '2. Visit our website\n' +
            '3. Visit our service center\n' +
            '4. WhatsApp us\n\n' +
            'We recommend booking in advance for better service.',
    
    // Payment
    'payment': 'We accept:\n' +
               '1. Cash\n' +
               '2. Credit/Debit Cards\n' +
               '3. Bank Transfers\n' +
               '4. Mobile Payments\n\n' +
               'All major credit cards are accepted.',
    
    // Warranty
    'warranty': 'Our service warranty includes:\n' +
                '1. 3 months warranty on all repairs\n' +
                '2. 1 year warranty on parts\n' +
                '3. Free follow-up service\n' +
                '4. 24/7 support during warranty period',
    
    // Team
    'team': 'Our service team includes:\n' +
            '1. Certified mechanics\n' +
            '2. Electrical specialists\n' +
            '3. Transmission experts\n' +
            '4. Brake system specialists\n' +
            '5. Emergency response team',
    
    // Feedback
    'feedback': 'You can provide feedback through:\n' +
                '1. Our website\n' +
                '2. Google reviews\n' +
                '3. Facebook page\n' +
                '4. Direct email to info@motron.com\n\n' +
                'We value your feedback to improve our services.'
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