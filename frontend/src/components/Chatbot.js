import React, { useEffect, useRef, useState } from "react";
import MarkdownRenderer from './MarkdownRenderer';
import axios from "axios";

function Chatbot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchRecipe = async () => {
    if (!query.trim()) return;
    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setQuery("");

    try {

      const queryDataToSend = sessionId.length > 0 
      ? { 'query': query, 'session_id': sessionId }
      : { 'query': query };

      const res = await axios.post("http://localhost:8000/v1/chat/chef", queryDataToSend);  
      const recipe = res.data;
      
      if (recipe.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: recipe.raw || "Sorry, something went wrong." },
        ]);
      } else {
        const recipeMessage = recipe.answer;
        setMessages((prev) => [...prev, { sender: "bot", text: recipeMessage }]);
        setSessionId(recipe.session_id);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching recipe. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchRecipe();
    }
  };

  return (
    <div
      style={{
        maxWidth: "70%",
        height: "100vh",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background: "#111827",
        color: "#f9fafb",
        fontFamily: "sans-serif",
      }}
    >
      {/* Fixed Header */}
      <div
        style={{
          background: "#1f2937",
          padding: "1rem",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#facc15",
          borderBottom: "1px solid #374151",
        }}
      >
        🍳 Cooking AI Chatbot
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#4F46E5" : "#374151",
              color: "#fff",
              padding: "0.75rem 1rem",
              borderRadius: "1rem",
              maxWidth: "80%",
            }}
          >
            {msg.sender === "bot" ? (
                <MarkdownRenderer markdown={msg.text} />
            ) : (
              msg.text
            )}
          </div>
        ))}

        {isTyping && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#374151",
              color: "#fff",
              padding: "0.75rem 1rem",
              borderRadius: "1rem",
              fontStyle: "italic",
            }}
          >
            Typing<span className="blinking-cursor">...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section Fixed at Bottom */}
      <div
        style={{
          display: "flex",
          padding: "1rem",
          borderTop: "1px solid #374151",
          background: "#1f2937",
        }}
      >
        <input
          type="text"
          value={query}
          placeholder="Ask about a recipe..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            padding: "0.75rem",
            fontSize: "1rem",
            border: "1px solid #4b5563",
            borderRadius: "0.5rem",
            marginRight: "0.5rem",
            backgroundColor: "#111827",
            color: "#f9fafb",
          }}
        />
        <button
          onClick={fetchRecipe}
          style={{
            padding: "0.75rem 1.25rem",
            backgroundColor: "#4F46E5",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      {/* Blinking Cursor Style */}
      <style>
        {`
          body {
            margin: 0;
            background-color: #0b0f19; /* or #000 for pure black */
            color: #f9fafb;
            font-family: sans-serif;
          }
          .blinking-cursor {
            font-weight: bold;
            animation: blink 1s steps(2, start) infinite;
          }

          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }

          ::placeholder {
            color: #9ca3af;
          }
        `}
      </style>
    </div>
  );
}

export default Chatbot;
