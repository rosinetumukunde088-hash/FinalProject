import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { chatbotService } from '../services/api';

const INITIAL_MESSAGES = [
  {
    role: 'bot',
    text: "Hello! I'm the Kiramart assistant. I can help you find products, navigate the store, or answer any questions. How can I help you today?",
    suggestions: ["Browse products", "Help me find something", "About Kiramart"],
    link: null
  }
];

function parseTextWithLinks(text, onNavigate) {
  const urlPattern = /(\/products|\/cart|\/login|\/register|\/profile|\/)/g;
  const parts = text.split(urlPattern);
  
  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      return (
        <button key={i} onClick={() => onNavigate(part)} className="chat-link-btn">
          {part === '/' ? 'Home' : part.replace(/^\//, '').replace(/-/g, ' ')}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(text);
      const botMessage = {
        role: 'bot',
        text: response.reply,
        link: response.link,
        suggestions: response.suggestions || []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          suggestions: ["Browse products", "Help me find something"],
          link: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <FiMessageCircle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Kiramart Assistant</h3>
                <p className="text-emerald-200 text-xs">Online | Kinyarwanda supported</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-emerald-600/30 rounded-lg transition">
              <FiX size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div className={`chat-message ${msg.role}`}>
                  {parseTextWithLinks(msg.text, handleNavigate)}
                </div>

                {msg.role === 'bot' && msg.link && (
                  <div style={{ paddingLeft: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      onClick={() => handleNavigate(msg.link.path)}
                      className="chat-link-btn"
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#059669',
                        background: '#ecfdf5',
                        border: '1px solid #d1fae5',
                        borderRadius: '0.5rem',
                        padding: '0.25rem 0.625rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {msg.link.text} →
                    </button>
                  </div>
                )}

                {msg.role === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="chat-suggestions" style={{ paddingLeft: '0.5rem' }}>
                    {msg.suggestions.map((s, si) => (
                      <button
                        key={si}
                        className="chat-suggestion-btn"
                        onClick={() => handleSuggestionClick(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-message bot">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={500}
            />
            <button type="submit" className="chatbot-send" disabled={!input.trim() || loading}>
              <FiSend size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
