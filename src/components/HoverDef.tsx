import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverDefProps {
  word: string;
  definition: string;
  pronunciation?: string;
  usage?: string;
  color?: string; // Accent color for the card
}

export default function HoverDef({ word, definition, pronunciation, usage, color = '#fda085' }: HoverDefProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      style={{ position: 'relative', display: 'inline-block', cursor: 'help' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ 
        borderBottom: `2px dashed ${color}`, 
        fontWeight: 'bold',
        color: 'inherit'
      }}>
        {word}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '10px',
              width: '250px',
              background: 'white',
              color: '#333',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 10,
              textAlign: 'left',
              fontSize: '0.9rem',
              fontFamily: 'sans-serif',
              pointerEvents: 'none' // Prevent flickering if mouse moves to tooltip
            }}
          >
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              color: color,
              marginBottom: '0.2rem' 
            }}>
              {word}
            </div>
            {pronunciation && (
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#888', 
                marginBottom: '0.5rem',
                fontFamily: 'monospace'
              }}>
                {pronunciation}
              </div>
            )}
            <div style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}>
              {definition}
            </div>
            {usage && (
              <div style={{ 
                fontSize: '0.8rem', 
                fontStyle: 'italic', 
                color: '#666',
                borderLeft: `3px solid ${color}`,
                paddingLeft: '8px'
              }}>
                "{usage}"
              </div>
            )}
            {/* Little arrow */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              marginLeft: '-6px',
              width: '12px',
              height: '12px',
              background: 'white',
              transform: 'rotate(45deg)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
