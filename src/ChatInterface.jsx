import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import logo from './assets/logo.jpeg';
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    try {
      const response = await fetch('https://ingest.testflaskapi.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.answer, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: 'Sorry, there was an error processing your request.', isUser: false }]);
    }
    setInput('');
  };

  return (
    <div className="flex flex-col h-[800px] w-full max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-lg overflow-hidden border border-gray-300" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)', backgroundSize: 'cover' }}>
      <div className="bg-gradient-to-r from-blue-200 via-gray-300 to-blue-200 text-white py-4 px-10 flex items-center space-x-4">
        <img src={logo} alt="Company Logo" className="h-16 w-auto object-contain" />
        <h1 className="text-2xl font-bold text-gray-800">Intelligent Document Q&A Chat</h1>
      </div>
      <div className="flex-grow overflow-auto p-10 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-gray-600 text-center pt-12 animate-fade-in-out text-xl">
            Let's get started! Ask me anything...
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`mb-6 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-6 py-4 rounded-xl shadow-md max-w-md ${
                message.isUser
                  ? 'bg-blue-500 text-white font-medium'
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}>
                {message.isUser ? (
                  message.text
                ) : (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-white p-6 border-t border-gray-300">
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Intelligent Document Q&A Chat</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-grow focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md px-5 py-4"
          />
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Send size={28} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
