import React, { useState } from 'react';

const InputArea = ({ placeholder = 'Type a message...',fileInputRef, handleSend,handleImageChange }) => {
  // State for the text input
  const [input, setInput] = useState('');

  return (
    <div
      className="input-area"
      style={{ display: 'flex', gap: 8, alignItems: 'center' }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend(input, setInput)}
        style={{ flexGrow: 1, padding: 8 }}
      />
      
      <button onClick={()=>{handleSend(input, setInput)}}>Enviar</button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current.click()} title="Send Image">📷</button>
    </div>
  );
};

export default InputArea;
