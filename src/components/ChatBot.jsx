import React from "react";
import { Mic, Send } from "lucide-react";

const ChatBot = () => {
  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-white font-semibold">
        CareBridgeAI
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        <div className="max-w-[70%] mr-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl text-sm">
          Hello! 👋 How can I help you today?
        </div>
        <div className="max-w-[70%] ml-auto bg-blue-600 text-white px-4 py-2 rounded-2xl text-sm">
          I need some help
        </div>
        <div className="max-w-[70%] mr-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl text-sm">
          Sure! Please tell me more.
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg">
          <Send className="w-5 h-5" />
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg">
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
