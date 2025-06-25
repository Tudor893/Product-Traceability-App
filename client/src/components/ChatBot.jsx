import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const styles = {
  floatingButton: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: '#707d5b',
    color: '#fff',
    border: 'none',
    fontSize: 30,
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatWindow: {
    position: 'fixed',
    bottom: 100,
    right: 30,
    width: 320,
    maxHeight: 370,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatHeader: {
    background: '#707d5b',
    color: '#fff',
    padding: '10px 16px',
    fontWeight: 'bold',
    fontSize: 16
  },
  chatBody: {
    flex: 1,
    padding: 12,
    overflowY: 'auto',
    background: '#f7f7f7'
  },
  chatInputArea: {
    display: 'flex',
    borderTop: '1px solid #eee',
    background: '#fff'
  },
  chatInput: {
    flex: 1,
    border: 'none',
    padding: 10,
    fontSize: 15,
    outline: 'none',
    background: '#fff'
  },
  sendButton: {
    background: '#707d5b',
    color: '#fff',
    border: 'none',
    padding: '0 18px',
    fontSize: 18,
    cursor: 'pointer'
  },
  message: {
    margin: '8px 0',
    padding: '8px 12px',
    borderRadius: 16,
    maxWidth: '80%',
    wordBreak: 'break-word'
  },
  userMsg: {
    background: '#d1e7ff',
    alignSelf: 'flex-end'
  },
  botMsg: {
    background: '#e9ecef',
    alignSelf: 'flex-start'
  }
};

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Salut! Cu ce te pot ajuta?' }
  ]);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (open && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    const userInput = input;
    setInput('');
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: userInput });
      setMessages(msgs => [...msgs, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Eroare la server.' }]);
    }
  };

  return (
    <>
      <button
        style={styles.floatingButton}
        onClick={() => setOpen(o => !o)}
      >
        💬
      </button>
      {open && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            Chatbot
            <span
              style={{ float: 'right', cursor: 'pointer', fontWeight: 'normal' }}
              onClick={() => setOpen(false)}
              title="Închide"
            >✕</span>
          </div>
          <div style={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  ...(msg.sender === 'user' ? styles.userMsg : styles.botMsg)
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.chatInputArea}>
            <input
              style={styles.chatInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Scrie un mesaj..."
              autoFocus
            />
            <button style={styles.sendButton} onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;