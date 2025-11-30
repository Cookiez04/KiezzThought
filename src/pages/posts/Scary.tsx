import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Scary() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Random glitch effect loop
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100 + Math.random() * 200);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#a0a0a0',
      fontFamily: '"Courier New", Courier, monospace',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)',
        opacity: 0.1,
        pointerEvents: 'none',
        zIndex: 10
      }} />

      <nav style={{ padding: '2rem', borderBottom: '1px solid #333' }}>
        <Link to="/" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
          &lt; Return_to_Safety
        </Link>
      </nav>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ 
          color: '#fff', 
          fontSize: '2.5rem', 
          marginBottom: '3rem',
          textTransform: 'uppercase',
          textShadow: glitch ? '2px 0 red, -2px 0 blue' : 'none',
          transform: glitch ? 'translate(2px, -2px)' : 'none'
        }}>
          System Failure: The Shadow
        </h1>

        <p style={{ marginBottom: '2rem', lineHeight: 1.8 }}>
          It started with a hum. Just a low frequency vibration in the server room floor. 
          I thought it was the cooling unit failing again. I wish it was the cooling unit.
        </p>

        <p style={{ marginBottom: '2rem', lineHeight: 1.8 }}>
          I checked the logs. 03:00 AM. <span style={{ color: '#fff' }}>Empty.</span>
        </p>

        <div style={{ 
          border: '1px solid #333', 
          padding: '1rem', 
          background: '#000', 
          fontFamily: 'monospace',
          color: 'red',
          marginBottom: '2rem'
        }}>
          &gt; ERROR: UNKNOWN ENTITY DETECTED IN SECTOR 4<br/>
          &gt; CAMERA FEED: CORRUPTED<br/>
          &gt; BIOMETRIC SCAN: NEGATIVE
        </div>

        <p style={{ marginBottom: '2rem', lineHeight: 1.8 }}>
          Then the lights flickered. Not all of them. Just the ones leading to the exit. 
          Like something was walking down the hallway, draining the power as it moved.
        </p>

        <p style={{ 
          marginTop: '4rem', 
          textAlign: 'center', 
          fontSize: '1.5rem', 
          color: '#fff',
          opacity: glitch ? 1 : 0.5 
        }}>
          DON'T LOOK BEHIND YOU.
        </p>
      </main>
    </div>
  );
}
