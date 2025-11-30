import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '-0.05em', marginBottom: '1rem' }}>
          KiezzThought.
        </h1>
        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
          A collection of scattered minds and digital artifacts.
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Waiting For Train Card */}
        <Link to="/post/waiting-for-train">
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              height: '350px',
              background: '#0f0f13', // Matches the post theme
              color: '#aab2bd',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '4px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              border: '1px solid #222',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Fog effect for card */}
            <div style={{
              position: 'absolute',
              top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6, letterSpacing: '1px' }}>
              <span style={{ textTransform: 'uppercase' }}>Personal</span>
              <span>Nov 30 • Midnight</span>
            </div>

            {/* Title */}
            <div style={{ zIndex: 1 }}>
              <h2 style={{ 
                fontFamily: '"Georgia", serif', 
                fontSize: '2rem', 
                fontWeight: 400,
                color: '#e0e0e0',
                marginBottom: '1rem'
              }}>
                The Quiet Train Station
              </h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>
                "The mind becomes a quiet train station at midnight. Only one passenger left standing..."
              </p>
            </div>

            {/* Footer */}
            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem' }}>🌫️ Melancholic</span>
              <span style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>Read entry &rarr;</span>
            </div>
          </motion.div>
        </Link>

      </div>
    </div>
  );
}
