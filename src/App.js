import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import ChatBubble from './components/ChatBubble'; // Importing the ChatBubble component
import Input from './components/Input'
import { format } from 'date-fns';  // If you want to format the date in a human-readable way
import { ptBR } from 'date-fns/locale';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const idRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (ws.current) {
      ws.current.close();
    }
    idRef.current = uuidv4(); 
    let initialMessages = []

    axios.get(process.env.REACT_APP_API_URL+"/getMessages").then((res)=>{
      initialMessages = res.data
      setMessages(initialMessages.reverse())
    })
    ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.current.onopen = () => console.log('WebSocket connected');
    
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [msg, ...prev]);
     };

    setMessages((prev)=>markMessagesWithDateDivider(prev))

    ws.current.onclose = () => console.log('WebSocket closed');
    ws.current.onerror = (e) => console.error('WebSocket error:', e);

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const sendMessage = (msgObj) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msgObj));
    } else {
      console.warn('WebSocket is not open. Cannot send message:', msgObj);
    }
  };

  const handleSend = (input, setInput) => {
    if (input === undefined) return
    if (!input.trim()) return;
    const message = {
      Id_user:idRef.current,
      Content: input.trim(),
      Timestamp: new Date().getTime()+"",
      Type:"text"
    };
    sendMessage(message);
    setInput("")
  };

  function markMessagesWithDateDivider(messages) {
  // Helper function to format the date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Extract the YYYY-MM-DD part
  };

  let previousDate = null;

  return messages.map((message, index) => {
    // Parse the timestamp of the message to get the date part
    const messageDate = new Date(message.timestamp);
    const messageDateString = formatDate(messageDate);

    // Check if this is the first message of the day
    const isFirstMessageOfDay = messageDateString !== previousDate;
    previousDate = messageDateString;

    // If it is the first message of the day, add "dateDivider" attribute
    if (isFirstMessageOfDay) {
      message.dateDivider = true;
    } else {
      message.dateDivider = false;
    }

    return message;
  });
}

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      sendMessage({
        Id_user:idRef.current,
        Content: reader.result,
        Timestamp: new Date().getTime()+"",
        Type:"image"
      });
    };
    reader.readAsDataURL(file);

    e.target.value = null;
  };

  return (
    <div className="chat-container">
      <div className="messages"
        ref={messagesEndRef}
      >
        {messages.reverse().map((msg, index) => { 
        const messageDate = new Date(msg.timestamp);
        const renderDateDivider = msg.dateDivider
       
        return (<React.Fragment>
        
        <ChatBubble key={index} index={index} 
            message={msg} 
            currentUserId={idRef.current} 
            setModalImage={setModalImage} 
            setIsModalOpen={setIsModalOpen} />
        <div>
              {renderDateDivider && (
              <div className="date-divider">
                {format(messageDate, 'dd MMMM, yyyy', {locale:ptBR})}
              </div>
            )}
       </div> 
       </React.Fragment>)   
         })}
         <div ref={messagesEndRef} />
      </div>
      <Input handleSend={handleSend} 
      handleImageChange={handleImageChange} 
      fileInputRef={fileInputRef}></Input>
    
          {isModalOpen && (
            <div
              className="modal-overlay"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={() => setIsModalOpen(false)}>✖️</button>
                <img src={modalImage} alt="full-img" className="full-image" />
              </div>
            </div>
          )}
    </div>
    
  );

  
}

export default App;
