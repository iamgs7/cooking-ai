import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import './MarkdownRenderer.css';

const MarkdownRenderer = ({ markdown }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
          h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
          h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
          ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
          ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
          li: ({node, ...props}) => <li className="markdown-li" {...props} />,
          p: ({node, ...props}) => <p className="markdown-p" {...props} />,
          code: ({node, inline, ...props}) => 
            inline ? 
              <code className="markdown-inline-code" {...props} /> : 
              <code className="markdown-code-block" {...props} />
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
