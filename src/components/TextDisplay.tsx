import React from 'react';

interface TextDisplayProps {
  text: string;
  userInput: string;
  errors: number[];
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ text, userInput, errors }) => {
  const renderText = () => {
    const characters = text.split('');
    const userCharacters = userInput.split('');

    return characters.map((char, index) => {
      let className = 'text-gray-400';
      
      if (index < userCharacters.length) {
        if (errors.includes(index)) {
          className = 'text-red-500 bg-red-500/20';
        } else {
          className = 'text-green-400 bg-green-500/20';
        }
      } else if (index === userCharacters.length) {
        className = 'text-white bg-blue-500/20 border-l-2 border-blue-400';
      }

      return (
        <span key={index} className={`px-0.5 rounded ${className}`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-6">
      <div className="text-lg font-mono leading-relaxed">
        {renderText()}
      </div>
    </div>
  );
};
