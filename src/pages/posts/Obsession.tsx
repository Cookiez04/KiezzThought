import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import SubconsciousStream from '../../components/SubconsciousStream';

// Ash particle effect (falling snow/ash)
const AshParticles = () => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 100 }).map((_, i) => i));
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      {particles.map((i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -10,
            opacity: 0,
            rotate: 0
          }}
          animate={{ 
            y: window.innerHeight + 10,
            x: (Math.random() - 0.5) * 100, // Gentle drift
            opacity: [0, 0.8, 0],
            rotate: 360
          }}
          transition={{ 
            duration: 5 + Math.random() * 10, // Slow falling
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: '#cccccc', // Ash grey
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};

// Text that feels heavy and serious
const HeavyText = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ position: 'relative' }}
    >
      {children}
    </motion.div>
  );
};

export default function Obsession() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background shifts from Midnight Blue to Deep Void Blue
  const bg = useTransform(scrollYProgress, [0, 1], ["#050a14", "#0a1124"]);
  
  // Text color shift for the title
  const titleColor = useTransform(scrollYProgress, [0, 0.2], ["#ffffff", "#b3cde0"]);

  return (
    <motion.div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: bg,
        color: '#e0e6ed',
        fontFamily: '"Helvetica Neue", "Arial", sans-serif',
        padding: '0',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      <SubconsciousStream />
      <AshParticles />

      {/* Navigation */}
      <nav style={{ padding: '2rem', position: 'fixed', top: 0, zIndex: 20, width: '100%', mixBlendMode: 'difference' }}>
        <Link to="/" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', textDecoration: 'none', opacity: 0.7 }}>
          &larr; Return
        </Link>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem', position: 'relative', zIndex: 10 }}>
        
        {/* Title */}
        <motion.div
            style={{ marginBottom: '6rem', textAlign: 'left' }}
        >
            <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ 
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                textTransform: 'uppercase', 
                lineHeight: 0.9, 
                color: titleColor,
                fontWeight: 900,
                letterSpacing: '-2px',
                wordBreak: 'break-word'
            }}
            >
            My Superpower<br/>
            <span style={{ color: '#4a4a4a' }}>is Obsession.</span>
            </motion.h1>
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                transition={{ delay: 1, duration: 1 }}
                style={{ height: '4px', background: '#fff', marginTop: '2rem' }}
            />
        </motion.div>

        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '1.1rem', lineHeight: 1.6, color: '#bfbfbf' }}>
          
          <HeavyText>
            <p style={{ marginBottom: '2rem' }}>
              It's what keeps me going even in bleak times. I don't care about much but once I set my sights on a goal to the point where I can visualize the moment that I achieve it, <strong style={{ color: '#fff', background: '#222', padding: '0 4px' }}>it's all or nothing.</strong>
            </p>
          </HeavyText>

          <HeavyText>
            <p style={{ marginBottom: '2rem' }}>
              But it does leave me with this feeling of like I tried to move a mountain. Most of the times it seems hopeless. When you are actively chasing something and also actively losing it, It does something to your mind.
            </p>
          </HeavyText>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ 
                borderLeft: '1px solid #fff', 
                paddingLeft: '2rem', 
                margin: '4rem 0',
                fontStyle: 'italic',
                color: '#fff',
                fontSize: '1.3rem',
                opacity: 0.8
            }}
          >
            "I'm in the middle of a poker game where I just bet all in and I got a bad hand."
          </motion.div>

          <HeavyText>
            <p style={{ marginBottom: '2rem' }}>
              And I can't control this variable that will make me succeed. That's the scariest part of it. It doesn't matter how much I worked and even if I did everything right, just one "no" from a certain someone would've just fuck me over.
            </p>
          </HeavyText>

          <p style={{ marginBottom: '4rem', opacity: 0.5 }}>
            I did try to change the outcome, to see if I have a fighting chance, and it still very much quite hopeless.
          </p>

          <hr style={{ borderColor: '#333', margin: '4rem 0' }} />

          <HeavyText>
            <h2 style={{ fontFamily: '"Helvetica Neue", sans-serif', fontSize: '2.5rem', color: '#fff', marginBottom: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>
              ONE. MORE. TRY.
            </h2>
          </HeavyText>

          <HeavyText>
            <p style={{ marginBottom: '2rem' }}>
              But... I wanna give it one more try. I wanna keep going until it's right. Failure is not an option at this point, I have to keep going with it. If I couldn't stop thinking about something and I want something as badly as I want this, then I gotta keep going.
            </p>
          </HeavyText>

          <HeavyText>
            <p style={{ marginBottom: '2rem' }}>
              If the difference between me and succeeding is trying one more time, then what the hell is stopping me from trying just one more time? I think I owe myself the chance to try one more time because I promised myself that <span style={{ borderBottom: '1px solid #fff' }}>I wouldn't die with this unfinished.</span>
            </p>
          </HeavyText>

          <div style={{ background: '#111', padding: '2rem', borderRadius: '0px', marginBottom: '3rem', border: '1px solid #333' }}>
            <p style={{ marginBottom: '1rem' }}>
              Right now it's unfinished. Right now every dream I had in my heart is gonna die within me. So, what the hell am I doing? What in the world am I doing? Nothing.
            </p>
            <p>
              I'm just letting probability that I still don't know yet the outcome control me when what I should be doing is getting up from whatever position that I am in and <strong style={{ color: '#fff' }}>getting my shit done.</strong>
            </p>
          </div>

          <HeavyText>
            <p style={{ marginBottom: '2rem' }}>
              I'm kinda bored living a life of comfort, I want that pain that grit that difficulty back. I can feel that fire within me reigniting. I know this is not a way to live for most people and I know that it will be incredibly challenging but the thing about me is I have never been happier to burn because I tasted it before.
            </p>
          </HeavyText>

          <p style={{ marginBottom: '6rem' }}>
            The sweetness and the tenderness of someone actually loving you and you can feel it in you heart and goes "oh shoot! this is it. this is what it felt like. i haven't felt like this in a long time".
          </p>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ 
              fontSize: 'clamp(3rem, 12vw, 6rem)', 
              fontWeight: 900, 
              textAlign: 'center', 
              color: '#fff',
              fontFamily: '"Helvetica Neue", sans-serif',
              cursor: 'default',
              letterSpacing: '-2px',
              wordBreak: 'break-all',
              opacity: 0.8
            }}
          >
            ALL IN.
          </motion.div>

        </div>
      </main>
    </motion.div>
  );
}
