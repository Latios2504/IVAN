import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderMarkdown = (text: string) => {
    // Split text into lines
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      const elements: React.ReactNode[] = [];
      let remainingText = line;
      let keyIndex = 0;
      
      // Process each line for markdown
      while (remainingText.length > 0) {
        // Look for bold text **text**
        const boldMatch = remainingText.match(/\*\*(.*?)\*\*/);
        
        if (boldMatch && typeof boldMatch.index === 'number') {
          // Add text before bold
          if (boldMatch.index > 0) {
            elements.push(
              <span key={`${lineIndex}-text-${keyIndex++}`}>
                {remainingText.substring(0, boldMatch.index)}
              </span>
            );
          }
          
          // Add bold text
          elements.push(
            <strong key={`${lineIndex}-bold-${keyIndex++}`} className="font-semibold">
              {boldMatch[1]}
            </strong>
          );
          
          // Update remaining text
          remainingText = remainingText.substring(boldMatch.index + boldMatch[0].length);
        } else {
          // Look for italic text *text*
          const italicMatch = remainingText.match(/\*(.*?)\*/);
          
          if (italicMatch && typeof italicMatch.index === 'number') {
            // Add text before italic
            if (italicMatch.index > 0) {
              elements.push(
                <span key={`${lineIndex}-text-${keyIndex++}`}>
                  {remainingText.substring(0, italicMatch.index)}
                </span>
              );
            }
            
            // Add italic text
            elements.push(
              <em key={`${lineIndex}-italic-${keyIndex++}`} className="italic">
                {italicMatch[1]}
              </em>
            );
            
            // Update remaining text
            remainingText = remainingText.substring(italicMatch.index + italicMatch[0].length);
          } else {
            // Look for code text `text`
            const codeMatch = remainingText.match(/`(.*?)`/);
            
            if (codeMatch && typeof codeMatch.index === 'number') {
              // Add text before code
              if (codeMatch.index > 0) {
                elements.push(
                  <span key={`${lineIndex}-text-${keyIndex++}`}>
                    {remainingText.substring(0, codeMatch.index)}
                  </span>
                );
              }
              
              // Add code text
              elements.push(
                <code key={`${lineIndex}-code-${keyIndex++}`} className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                  {codeMatch[1]}
                </code>
              );
              
              // Update remaining text
              remainingText = remainingText.substring(codeMatch.index + codeMatch[0].length);
            } else {
              // No more markdown, add remaining text
              if (remainingText.length > 0) {
                elements.push(
                  <span key={`${lineIndex}-text-${keyIndex++}`}>
                    {remainingText}
                  </span>
                );
              }
              break;
            }
          }
        }
      }
      
      return (
        <div key={`line-${lineIndex}`}>
          {elements}
          {lineIndex < lines.length - 1 && <br />}
        </div>
      );
    });
  };

  return (
    <div className={className}>
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;