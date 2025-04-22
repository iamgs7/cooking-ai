import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const TypingMarkdownRenderer = ({ markdown, typingSpeed = 0.5 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < markdown.length) {
        setDisplayedText(prev => prev + markdown.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [markdown, typingSpeed]);

  return (
    <div>
      <MarkdownRenderer markdown={displayedText} />
      {isTyping && <span className="typing-cursor">|</span>}
    </div>
  );
};

export default TypingMarkdownRenderer;
