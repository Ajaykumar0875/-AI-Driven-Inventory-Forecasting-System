import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { sendChatMessage } from '../services/api';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am StockGPT. Ask me anything about your inventory.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = error.response?.data?.reply || "Network Error: Could not reach the server.";
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">StockGPT Assistant</span>
            </div>
            <button onClick={toggleChat} className="hover:bg-white/20 p-1 rounded-lg transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  ${msg.role === 'ai' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'}
                `}>
                  {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`
                  max-w-[75%] p-3 rounded-2xl text-sm
                  ${msg.role === 'ai' 
                    ? 'bg-slate-800 text-slate-200 rounded-tl-none' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                  }
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Bot size={16} className="text-indigo-400" />
                 </div>
                 <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-slate-800/50 border-t border-slate-700">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about inventory..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={toggleChat}
        className={`
          flex items-center gap-2 px-4 py-4 rounded-full shadow-lg shadow-blue-900/40 transition-all duration-300
          ${isOpen ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'}
        `}
      >
        {isOpen ? (
           <X size={24} />
        ) : (
           <>
              <MessageSquare size={24} />
              <span className="font-semibold pr-1">Ask AI</span>
           </>
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;
