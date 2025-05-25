import { useState, useEffect } from 'react';

const ErrorMessage = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide the error after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="error-message-container">
      <div className="error-message">
        <p>{message}</p>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="error-close-btn"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
