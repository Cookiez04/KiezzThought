import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// A collection of raw, unfiltered thoughts
const THOUGHTS = [
  "is this worth it?",
  "don't stop",
  "just one more try",
  "tired but awake",
  "keep moving",
  "what if I fail?",
  "silence is loud",
  "focus",
  "burn it all",
  "almost there",
  "why am I like this?",
  "make it count",
  "nobody is coming to save you",
  "wake up",
  "time is running out"
];

interface Thought {
  id: number;
  text: string;
  x: number; // Random horizontal position (percent)
  angle: number; // Random angle for shooting direction
  speed: number; // Random speed
}

export default function SubconsciousStream() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) {
      setThoughts([]);
      return;
    }

    // Add a new thought every 2-4 seconds
    const interval = setInterval(() => {
      // Angle: Random between -30 (left tilt) and 30 (right tilt)
      // We don't want them too horizontal, just shooting up at an angle
      const angle = (Math.random() - 0.5) * 60; 
      
      const newThought: Thought = {
        id: Date.now(),
        text: THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)],
        x: Math.random() * 80 + 10, // Keep within 10% - 90% of screen width
        angle: angle,
        speed: 3 + Math.random() * 3 // Random duration between 3-6s
      };

      setThoughts(prev => [...prev.slice(-6), newThought]); // Keep max 7 on screen

      // Remove the thought after it finishes animation
      setTimeout(() => {
        setThoughts(prev => prev.filter(t => t.id !== newThought.id));
      }, newThought.speed * 1000);

    }, 2000); // Faster spawn rate for "shooting" feel

    return () => clearInterval(interval);
  }, [isEnabled]);

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsEnabled(!isEnabled)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 100,
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: isEnabled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          cursor: 'pointer',
          backdropFilter: 'blur(5px)',
          fontFamily: 'monospace',
          transition: 'all 0.3s ease'
        }}
      >
        {isEnabled ? "Silence Thoughts" : "Enable Thoughts"}
      </button>

      {/* Stream Container */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '40vh', // Increased height for longer trajectories
        pointerEvents: 'none',
        zIndex: 50,
        overflow: 'hidden'
      }}>
        <AnimatePresence>
          {thoughts.map((thought) => (
            <motion.div
              key={thought.id}
              initial={{ 
                opacity: 0, 
                y: 100, // Start below screen
                x: 0,
                scale: 0.5,
                rotate: thought.angle / 2 // Slight rotation to match trajectory
              }}
              animate={{ 
                opacity: [0, 0.6, 0], // Fade in fast, then fade out
                y: -300, // Shoot way up
                x: thought.angle * 5, // Move horizontally based on angle
                scale: 1 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: thought.speed, 
                ease: "easeOut" 
              }}
              style={{
                position: 'absolute',
                left: `${thought.x}%`,
                bottom: '0',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                textShadow: '0 0 5px rgba(255,255,255,0.2)',
                fontWeight: 'bold'
              }}
            >
              {thought.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
