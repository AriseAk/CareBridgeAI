import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, BookOpen } from "lucide-react";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      text: "Hello! 👋 I am your Medical Assistant. Describe your symptoms, and I'll find similar past cases to help.", 
      sender: "bot", 
      sources: []
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Connect to your Python Backend
      const response = await fetch('http://127.0.0.1:5000/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.text }), 
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      
      const botMessage = { 
        text: data.answer, 
        sender: "bot",
        sources: data.sources || []
      };
      
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "Sorry, I'm having trouble connecting to the medical database.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Height calculation: 100vh minus roughly 64px for your main Navbar
    <div className="h-[calc(100vh-64px)] w-full bg-slate-50 flex flex-col font-sans text-gray-800">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white border border-gray-100 text-slate-700 rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              
              {/* Citations */}
              {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                    <BookOpen size={12} /> Referenced Cases:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <div key={idx} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer transition-colors" title={`Case ID: ${source.id}`}>
                         Case #{source.id}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
             <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
            <input
                type="text"
                placeholder="Describe symptoms..."
                className="w-full pl-5 pr-24 py-4 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none text-slate-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute right-2 flex gap-1">
                <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;