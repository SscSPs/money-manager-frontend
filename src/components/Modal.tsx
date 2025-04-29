import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  // Inline styles - consider moving to CSS file for larger apps
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black overlay
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1050, // Ensure it's above the navbar (which is 1000)
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#2f2f2f', // Dark background for modal content
    padding: '20px',
    borderRadius: '8px',
    minWidth: '400px', // Minimum width
    maxWidth: '80%', // Maximum width
    maxHeight: '80vh', // Maximum height
    overflowY: 'auto', // Allow scrolling within the modal if content overflows
    position: 'relative', // Needed for absolute positioning of close button
    color: 'rgba(255, 255, 255, 0.87)', // Light text
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: 'rgba(255, 255, 255, 0.87)',
    cursor: 'pointer',
  };

  return (
    <div style={overlayStyle} onClick={onClose}> {/* Close on overlay click */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
        <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal; 