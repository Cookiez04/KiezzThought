import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Component to handle the "Erosion" effect for a block of text
const ErodingBlock = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // When the element leaves the viewport (scrolled past), trigger erosion
  const opacity = useTransform(scrollYProgress, [0.1, 0.5, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const blur = useTransform(scrollYProgress, [0.8, 1], ["0px", "10px"]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y, filter: `blur(${blur})`, position: 'relative' }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

// Dust particles that float up from the bottom
const Dust = () => {
  const [dusts, setDusts] = useState<number[]>([]);

  useEffect(() => {
    const count = 50;
    const newDusts = Array.from({ length: count }).map((_, i) => i);
    setDusts(newDusts);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {dusts.map((i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 100,
            opacity: 0 
          }}
          animate={{ 
            y: -100,
            opacity: [0, Math.random() * 0.5, 0],
            x: `+=${Math.random() * 100 - 50}`
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            background: '#fff',
            borderRadius: '50%'
          }}
        />
      ))}
    </div>
  );
};

export default function WaitingForTrain() {
  return (
    <div style={{
      minHeight: '200vh', // Extra height to allow scrolling
      background: '#0f0f13', 
      color: '#aab2bd',      
      fontFamily: '"Georgia", serif',
      padding: '0',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <Dust />

      {/* Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: '2rem', 
        left: '2rem', 
        zIndex: 10 
      }}>
        <Link to="/" style={{ 
          color: '#666', 
          textTransform: 'uppercase', 
          letterSpacing: '2px', 
          fontSize: '0.7rem',
          borderBottom: '1px solid transparent'
        }}>
          &larr; Return to Station
        </Link>
      </nav>

      <main style={{ 
        maxWidth: '700px', 
        margin: '0 auto', 
        padding: '8rem 2rem 20rem', // Huge bottom padding for the "end" feeling
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Title Section */}
        <ErodingBlock>
          <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 400, 
              color: '#e0e0e0',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}>
              The Quiet Train Station
            </h1>
            <div style={{ 
              height: '1px', 
              width: '100px', 
              background: 'linear-gradient(90deg, transparent, #444, transparent)',
              margin: '0 auto'
            }} />
            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: '#555', 
              fontStyle: 'italic' 
            }}>
              Nov 28, 2025 • Midnight
            </p>
          </div>
        </ErodingBlock>

        {/* Main Content - Split into blocks for individual erosion */}
        <div style={{ lineHeight: 1.9, fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          
          <ErodingBlock>
            <p>The mind becomes a quiet train station at midnight.</p>
          </ErodingBlock>

          <ErodingBlock>
            <p>
              Only one passenger left standing on the platform—me—hands in pockets, rehearsing all the futures I’ve already promised myself. The tracks stretch forward into fog, no train in sight, no timetable posted. Just rusted steel and the ghost of momentum.
            </p>
          </ErodingBlock>

          <ErodingBlock>
            <p>
              I said I’d wait, and waiting is easy when you believe the train exists.
            </p>
          </ErodingBlock>

          <ErodingBlock>
            <p>
              I wrote to her with every ounce of clarity I could scrape from the storm, laid down the blueprint of my own heart: job, degree, city far from this one, a life built plank by plank toward a door she might open someday. I told her she doesn’t have to step through it now. I only asked if she imagines that doorway at all.
            </p>
          </ErodingBlock>

          <ErodingBlock>
            <div style={{ 
              padding: '2rem', 
              borderLeft: '2px solid #333',
              color: '#888',
              fontStyle: 'italic'
            }}>
              And now there is silence.
            </div>
          </ErodingBlock>

          <ErodingBlock>
            <p>
              Not rejection, not acceptance. Just the kind of quiet that makes you count your own pulse to know you’re still here. The kind where every second passes like glass dragged across skin. She read it. She hasn’t said anything yet. And that <em>yet</em> is a weight that swings between hope and self-inflicted cruelty.
            </p>
          </ErodingBlock>

          <ErodingBlock>
            <p>
              It feels like watching someone through a window as rain starts to fall—you could run outside, knock on the glass, but you’re afraid the sound of it might scare them back inside forever. So you stay there, drenched in your own restraint, convincing yourself that patience is noble… while secretly wondering if you’re mistaking decay for devotion.
            </p>
          </ErodingBlock>

          <ErodingBlock>
            <p>
              Tonight, all the thoughts boil down to this:<br/><br/>
              <span style={{ color: '#d0d0d0' }}>If she does not answer, did I still do the right thing by being honest?</span><br/>
              <span style={{ color: '#d0d0d0' }}>And if she does answer… will it hurt more than the silence?</span>
            </p>
          </ErodingBlock>

          <ErodingBlock>
            <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem', marginTop: '4rem' }}>
              <p>No answer. Not yet.</p>
              <p style={{ marginTop: '1rem' }}>The rails hum with a train that may never come. I stay standing anyway.</p>
            </div>
          </ErodingBlock>

        </div>
      </main>
    </div>
  );
}
