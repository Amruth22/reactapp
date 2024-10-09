import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import logo from './assets/logo.jpeg';
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim() === '' || isSending) return;
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');
    setIsSending(true);
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
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full max-w-[90vw] lg:max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-300">
      <div className="fixed top-0 left-0 right-0 py-4 px-8 flex items-center justify-center bg-white shadow-md z-10 rounded-t-2xl">
        <div className="absolute left-8 flex items-center space-x-4">
          <img src={logo} alt="Company Logo" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">Intelligent Document Q&A Chat</h1>
      </div>
      <div className="flex-grow mt-16 overflow-auto p-8 bg-white rounded-lg shadow-inner">
        <div className="text-center mb-12 text-gray-700 text-lg font-medium bg-gray-100 p-4 rounded-lg shadow">
          Welcome to the Intelligent Document Q&A Chat. Ask anything related to your documents!
        </div>
        {messages.length === 0 ? (
          <div className="text-gray-600 text-center pt-16 animate-fade-in-out text-2xl">
            Let's get started! Ask me anything...
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`inline-block px-6 py-4 rounded-2xl shadow-lg max-w-md ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}>
                  {message.isUser ? (
                    message.text
                  ) : (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-300 shadow-md z-10 rounded-b-2xl">
        <div className="flex items-center space-x-3 px-4">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-grow focus:ring-4 focus:ring-blue-400 rounded-full shadow-md px-4 py-2 text-lg"
            disabled={isSending}
          />
          <Button onClick={handleSend} disabled={isSending} className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 ease-in-out transform ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
            <Send size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;