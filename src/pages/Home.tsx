import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const showResolutionDecayRate = true;
  const showObsession = false;
  const showWaitingForTrain = false;
  const showWaitingRoom = false;
  const showChaosEngine = false;

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
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', 
        gap: '2rem' 
      }}>
        {showResolutionDecayRate ? (
          <Link to="/post/resolution-decay-rate">
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                height: '350px',
                background: '#ff4d00',
                color: '#000',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '0px',
                boxShadow: '12px 12px 0 #000',
                border: '4px solid #000',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none', backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

              <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.9, fontWeight: 'bold', letterSpacing: '1px' }}>
                <span style={{ textTransform: 'uppercase' }}>Interactive</span>
                <span>Jan 01 • 12:00 AM</span>
              </div>

              <div style={{ zIndex: 1 }}>
                <h2 style={{ 
                  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                  fontSize: '2.8rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  letterSpacing: '-1px',
                  fontWeight: 900,
                  lineHeight: 0.9
                }}>
                  Resolution
                  <br />
                  Decay Rate
                </h2>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.9, maxWidth: '40ch' }}>
                  It’s not motivational garbage. It’s math.
                </p>
              </div>

              <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(0,0,0,0.35)', paddingTop: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem' }}>🧪 Reality Engine</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Run →</span>
              </div>
            </motion.div>
          </Link>
        ) : null}

        {/* Obsession Card */}
        {showObsession ? <Link to="/post/obsession">
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              height: '350px',
              background: 'linear-gradient(45deg, #0a1124, #050a14)',
              color: '#e0e6ed',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '0px',
              boxShadow: '0 10px 30px rgba(10, 20, 40, 0.5)',
              border: '1px solid #1a2a40',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ash overlay */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 10px)',
              pointerEvents: 'none',
              opacity: 0.3
            }} />

            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6, color: '#b3cde0', fontWeight: 'bold', letterSpacing: '1px' }}>
              <span>GRIT</span>
              <span>Dec 21 • 09:15 PM</span>
            </div>

            <div style={{ zIndex: 1 }}>
              <h2 style={{ 
                fontFamily: '"Helvetica Neue", sans-serif', 
                fontSize: '2.5rem', 
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '0.5rem',
                letterSpacing: '-1px',
                fontWeight: 900
              }}>
                Obsession
              </h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.8, color: '#bfbfbf' }}>
                "My superpower is obsession. It's what keeps me going even in bleak times..."
              </p>
            </div>

            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem' }}>⛓️ Determination</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>ALL IN &rarr;</span>
            </div>
          </motion.div>
        </Link> : null}

        {/* Waiting For Train Card */}
        {showWaitingForTrain ? <Link to="/post/waiting-for-train">
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
        </Link> : null}

        {showWaitingRoom ? <Link to="/post/waiting-room">
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              height: '350px',
              background: '#facc15',
              color: '#000',
              padding: '2.5rem 2.5rem 2.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '0px',
              boxShadow: '12px 12px 0 #000',
              border: '4px solid #000',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none', backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8, fontWeight: 'bold', letterSpacing: '1px' }}>
              <span style={{ textTransform: 'uppercase' }}>Interactive</span>
              <span>Dec 29 • 10:40 PM</span>
            </div>

            <div style={{ zIndex: 1 }}>
              <h2 style={{ 
                fontFamily: '"Helvetica Neue", sans-serif', 
                fontSize: '2.5rem', 
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
                letterSpacing: '-1px',
                fontWeight: 900,
                lineHeight: 0.95
              }}>
                The Waiting Room
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.9, maxWidth: '34ch' }}>
                How much of your existence is actually yours?
              </p>
            </div>

            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(0,0,0,0.35)', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem' }}>⏳ Sliders + 80-year grid</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Enter &rarr;</span>
            </div>
          </motion.div>
        </Link> : null}

        {showChaosEngine ? <Link to="/post/chaos-engine">
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              height: '350px',
              background: '#111',
              color: '#eee',
              padding: '2.25rem 2.25rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '0px',
              boxShadow: '0 0 0 2px #333, 12px 12px 0 #000',
              border: '2px solid #333',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.08,
              backgroundImage: 'radial-gradient(#ccff00 1px, transparent 1px)',
              backgroundSize: '14px 14px'
            }} />

            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8, fontWeight: 'bold', letterSpacing: '1px', color: '#ccff00' }}>
              <span style={{ textTransform: 'uppercase' }}>Interactive</span>
              <span>Dec 29 • 11:05 PM</span>
            </div>

            <div style={{ zIndex: 1 }}>
              <h2 style={{ 
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: '2.2rem', 
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
                letterSpacing: '-1px',
                fontWeight: 900,
                lineHeight: 1
              }}>
                The Chaos Engine
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.85, maxWidth: '40ch' }}>
                Choose. Then see what you didn’t choose.
              </p>
            </div>

            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid rgba(204,255,0,0.35)', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(238,238,238,0.85)' }}>🏆 Endings trophy room</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ccff00' }}>Boot &rarr;</span>
            </div>
          </motion.div>
        </Link> : null}

      </div>
    </div>
  );
}
