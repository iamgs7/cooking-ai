import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

function Chatbot() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [streamedMessage, setStreamedMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatRef = useRef(null);
  const userId = 'user1';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch(`http://localhost:8000/history?user_id=${userId}`);
    const data = await res.json();
    setChatHistory(data.chat_history);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, 100);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setStreamedMessage('');
    setIsStreaming(true);

    // Add user message and placeholder for AI response
    setChatHistory(prev => [...prev, { user: userMessage, ai: '' }]);
    scrollToBottom();

    try {
      const response = await fetch(
        `http://localhost:8000/suggest/stream?ingredient=${encodeURIComponent(userMessage)}&user_id=${userId}`
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;

        // Format the response with newlines for markdown (adding line breaks)
        const formattedResponse = fullText.replace(/\n/g, '\n\n'); // Double newlines for markdown breaks

        setStreamedMessage(formattedResponse);
        scrollToBottom();
      }

      setIsStreaming(false);
      await fetchHistory(); // Refresh full chat with saved AI response

    } catch (err) {
      console.error("Streaming error:", err);
      setIsStreaming(false);
    }
  };

  return (
    <div className="chatbot-container" style={{ padding: '1rem', maxWidth: '700px', margin: 'auto' }}>
      <h2>🍳 Cooking AI Chatbot</h2>

      <div ref={chatRef} style={{
        border: '1px solid #ccc', padding: '1rem', borderRadius: '8px',
        height: '60vh', overflowY: 'auto', marginBottom: '1rem',
        backgroundColor: '#fafafa'
      }}>
        {chatHistory.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <div><strong>You:</strong> {entry.user}</div>
            <div style={{
              background: '#f4f4f4', padding: '0.75rem', borderRadius: '6px',
              marginTop: '0.5rem', fontFamily: 'monospace'
            }}>
              <ReactMarkdown>{entry.ai}</ReactMarkdown>
            </div>
          </div>
        ))}

        {isStreaming && (
          <div style={{
            background: '#eef', padding: '0.75rem', borderRadius: '6px',
            fontFamily: 'monospace'
          }}>
            <ReactMarkdown>{streamedMessage}</ReactMarkdown>
            <span className="blinking-cursor">▌</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          placeholder="Enter an ingredient (e.g. spinach)"
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '0.75rem' }}
        />
        <button onClick={sendMessage} disabled={isStreaming} style={{ padding: '0.75rem 1rem' }}>
          {isStreaming ? "..." : "Send"}
        </button>
      </div>

      <style>{`
        .blinking-cursor {
          animation: blink 1s steps(2, start) infinite;
        }

        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}

export default Chatbot;
