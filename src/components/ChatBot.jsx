import React, { useState } from "react"; // <-- 1. Import useState
import { Mic, Send } from "lucide-react";

const ChatBot = () => {
  // --- 2. Set up state to manage the conversation ---
  const [input, setInput] = useState(""); // Holds the text in the input box
  const [messages, setMessages] = useState([
    { text: "Hello! 👋 How can I help you today?", sender: "bot" },
  ]); // Holds the list of all messages
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. Handle form submission with a JavaScript function ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default page reload
    if (!input.trim()) return; // Don't send empty messages

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to chat
    setInput(""); // Clear the input box
    setIsLoading(true);

    try {
      // --- 4. The fetch call is now inside the event handler ---
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { text: data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]); // Add bot response to chat

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      const errorMessage = { text: "Sorry, I'm having trouble connecting.", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-white font-semibold">
        CareBridgeAI
      </div>

      {/* --- 5. Messages are now rendered dynamically from state --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
         {isLoading && (
            <div className="max-w-[70%] mr-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl text-sm">
                Thinking...
            </div>
        )}
      </div>

      {/* --- 6. The form now uses onSubmit and the input is controlled --- */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 p-3 border-t bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg" disabled={isLoading}>
            <Send className="w-5 h-5" />
          </button>
          <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;