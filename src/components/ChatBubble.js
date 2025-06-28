import React from 'react';
import '../styles/bubble-style.css';

const ChatBubble = ({index, message, currentUserId, setModalImage, setIsModalOpen }) => {
  const isMine = message.Id_user === currentUserId; // Check if message is from the current user
  console.log(message.Id_user)
  const bubbleStyle = {
    backgroundColor: isMine ? '#d4f8c4' : '#6a7da3', // Light green for mine, slate blue for others
    color: isMine ? '#000' : '#fff', // Black for own messages, white for others
    alignSelf: isMine ? 'flex-end' : 'flex-start',
  };
  function formatDate(dateString){
     const date = new Date(dateString);
     const formattedTime = date.toLocaleTimeString('pt-BR', {
       hour: '2-digit',
       minute: '2-digit',
       hour12: false, // 24-hour format
     });
     
     return formattedTime
  }
  return (
    <div id={index} className={`message-bubble ${isMine ? 'sent' : 'received'}`} style={bubbleStyle}>
      {message.type === 'image' ? (
        <img src={message.content} alt="sent-img" style={{ maxWidth: '200px', borderRadius: '8px' }} 
        onClick={() => {
                    setModalImage(message.content);
                    setIsModalOpen(true);
                     }}
        />
      ) : (
        <div>{message.content}</div>
      )}
      <div className="timestamp" style={{ color: isMine ? 'gray' : 'white' }}>
        {formatDate(message.timestamp)}
      </div>
    </div>
  );
};

export default ChatBubble;
