import { useState } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "👋 Hello! I'm your AI Procurement Assistant. Ask me about vendors, approvals, or insights."
    }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    // Get the token from localStorage (assuming you save it there after login)
    const token = localStorage.getItem("access_token");

    try {
      // This URL must match the path listed in your /docs (which is /chatbot/chat)
const response = await fetch("http://127.0.0.1:8001/chatbot/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access_token")}` 
  },
  body: JSON.stringify({ message: userMessage })
});
      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.message } // Changed from data.reply to data.message to match your schema
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", text: "⚠ Unable to connect to AI Assistant." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-96 h-[550px] rounded-xl shadow-2xl border flex flex-col">
          <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
            <h2 className="font-bold text-lg">AI Procurement Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`p-3 rounded-lg max-w-[90%] ${msg.role === "bot" ? "bg-gray-100 text-left" : "bg-blue-600 text-white ml-auto"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            />
            <button onClick={sendMessage} className="bg-blue-700 text-white px-4 rounded-lg">Send</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-blue-700 text-white rounded-full px-6 py-4 shadow-xl hover:bg-blue-800">
          💬 AI Chat
        </button>
      )}
    </div>
  );
}