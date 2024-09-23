import React from 'react';
import './response.css'; // Import a CSS file for styling

const Response = ({ content }) => {
  // Function to parse the text and wrap code blocks in <pre><code> tags
  const renderContent = () => {
    // Regular expression to find code blocks (```...```)
    const codeBlockRegex = /```([\s\S]*?)```/g;

    // Split content into text and code blocks
    const parts = content?.split(codeBlockRegex);

    return parts?.map((part, index) => {
      // If it's a code block, wrap it in <pre><code>
      if (index % 2 === 1) {
        return (
          <pre key={index}>
            <code>{part}</code>
          </pre>
        );
      }
      // Otherwise, return the text part
      return <p key={index}>{part}</p>;
    });
  };

  return (
    <div id="Response">
      {renderContent()}
    </div>
  );
};

export default Response;
