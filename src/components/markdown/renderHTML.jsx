import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const renderHTML = text => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      children={text}
      components={{
        code({ node, inline, className = '', children, ...props }) {
          const language = /language-(\w+)/.exec(className);
          const showLineNumbers = /=\d*$/.test(className);
          const numbersFrom = +/\d+/.exec(className)?.[0] || 1;
          return !inline ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, '')}
              language={language?.[1] || 'text'}
              showLineNumbers={showLineNumbers}
              startingLineNumber={numbersFrom}
              lineNumberStyle={{
                borderRight: '3px solid #b9b9b9',
                marginRight: '8px',
                paddingRight: '5px',
              }}
              customStyle={{ padding: '2px' }}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default renderHTML;
