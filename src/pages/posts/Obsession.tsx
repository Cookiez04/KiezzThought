import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Fire particle effect component
const EmberParticles = () => {
  const [embers, setEmbers] = useState<number[]>([]);

  useEffect(() => {
    // Increase count for visibility
    setEmbers(Array.from({ length: 50 }).map((_, i) => i));
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      {embers.map((i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 50, // Start slightly below screen
            opacity: 0,
            scale: 0.5
          }}
          animate={{ 
            y: -100, // Move all the way up
            x: (Math.random() - 0.5) * 200, // Random drift
            opacity: [0, 1, 1, 0], // Fade in, stay visible, fade out
            scale: [0.5, 1.5, 0] // Grow then shrink
          }}
          transition={{ 
            duration: 3 + Math.random() * 5, // Slower movement
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`, // Distribute horizontally
            width: Math.random() * 6 + 4, // Larger particles
            height: Math.random() * 6 + 4,
            background: i % 2 === 0 ? '#ff4500' : '#ff8c00', // Bright Orange/Red
            borderRadius: '50%',
            boxShadow: '0 0 15px 4px rgba(255, 69, 0, 0.6)' // Stronger glow
          }}
        />
      ))}
    </div>
  );
};

// Text that "burns" into view (glows)
const BurningText = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0.2, filter: 'blur(5px)' }}
      whileInView={{ 
        opacity: 1, 
        filter: 'blur(0px)',
        textShadow: [
            '0 0 0px transparent', 
            '0 0 20px #ff4500', 
            '0 0 10px #ff0000', 
            '0 0 0px transparent'
        ] 
      }}
      viewport={{ once: false, amount: 0.5 }} // Trigger every time it enters view
      transition={{ duration: 0.8 }}
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

  // Background gets hotter (redder) as you scroll down
  const bg = useTransform(scrollYProgress, [0, 1], ["#1a0505", "#4a0000"]);

  return (
    <motion.div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: bg,
        color: '#ffdddd',
        fontFamily: '"Impact", "Arial Black", sans-serif', // Bold, intense font
        padding: '0',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      <EmberParticles />

      {/* Navigation */}
      <nav style={{ padding: '2rem', position: 'fixed', top: 0, zIndex: 20, width: '100%', mixBlendMode: 'difference' }}>
        <Link to="/" style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
          &larr; Back
        </Link>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem', position: 'relative', zIndex: 10 }}>
        
        {/* Title */}
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{ 
            fontSize: 'clamp(3rem, 10vw, 5rem)', // Responsive font size
            textTransform: 'uppercase', 
            lineHeight: 0.9, 
            marginBottom: '4rem',
            color: '#ff3300',
            textShadow: '0 0 20px rgba(255, 51, 0, 0.5)',
            wordBreak: 'break-word' // Prevent overflow on small screens
          }}
        >
          My Superpower<br/>is Obsession.
        </motion.h1>

        <div style={{ fontFamily: '"Georgia", serif', fontSize: '1.2rem', lineHeight: 1.8, color: '#ffcccc' }}>
          
          <BurningText>
            <p style={{ marginBottom: '2rem' }}>
              It's what keeps me going even in bleak times. I don't care about much but once I set my sights on a goal to the point where I can visualize the moment that I achieve it, <strong style={{ color: '#fff', textShadow: '0 0 10px red' }}>it's all or nothing.</strong>
            </p>
          </BurningText>

          <BurningText>
            <p style={{ marginBottom: '2rem' }}>
              But it does leave me with this feeling of like I tried to move a mountain. Most of the times it seems hopeless. When you are actively chasing something and also actively losing it, It does something to your mind.
            </p>
          </BurningText>

          <div style={{ 
            borderLeft: '4px solid #ff4500', 
            paddingLeft: '1.5rem', 
            margin: '3rem 0',
            fontStyle: 'italic',
            color: '#fff',
            background: 'rgba(255, 0, 0, 0.1)',
            padding: '1rem'
          }}>
            "I'm in the middle of a poker game where I just bet all in and I got a bad hand."
          </div>

          <BurningText>
            <p style={{ marginBottom: '2rem' }}>
              And I can't control this variable that will make me succeed. That's the scariest part of it. It doesn't matter how much I worked and even if I did everything right, just one "no" from a certain someone would've just fuck me over.
            </p>
          </BurningText>

          <p style={{ marginBottom: '4rem', opacity: 0.7 }}>
            I did try to change the outcome, to see if I have a fighting chance, and it still very much quite hopeless.
          </p>

          <hr style={{ borderColor: '#ff4500', opacity: 0.3, margin: '4rem 0', boxShadow: '0 0 10px red' }} />

          <BurningText>
            <h2 style={{ fontFamily: '"Impact", sans-serif', fontSize: '3rem', color: '#ff4500', marginBottom: '2rem', textShadow: '0 0 15px orange' }}>
              ONE. MORE. TRY.
            </h2>
          </BurningText>

          <BurningText>
            <p style={{ marginBottom: '2rem' }}>
              But... I wanna give it one more try. I wanna keep going until it's right. Failure is not an option at this point, I have to keep going with it. If I couldn't stop thinking about something and I want something as badly as I want this, then I gotta keep going.
            </p>
          </BurningText>

          <BurningText>
            <p style={{ marginBottom: '2rem' }}>
              If the difference between me and succeeding is trying one more time, then what the hell is stopping me from trying just one more time? I think I owe myself the chance to try one more time because I promised myself that I wouldn't die with this unfinished.
            </p>
          </BurningText>

          <div style={{ background: 'rgba(255, 69, 0, 0.15)', padding: '2rem', borderRadius: '8px', marginBottom: '3rem', border: '1px solid #ff4500' }}>
            <p style={{ marginBottom: '1rem' }}>
              Right now it's unfinished. Right now every dream I had in my heart is gonna die within me. So, what the hell am I doing? What in the world am I doing? Nothing.
            </p>
            <p>
              I'm just letting probability that I still don't know yet the outcome control me when what I should be doing is getting up from whatever position that I am in and <strong style={{ textDecoration: 'underline', color: '#fff' }}>getting my shit done.</strong>
            </p>
          </div>

          <BurningText>
            <p style={{ marginBottom: '2rem' }}>
              I'm kinda bored living a life of comfort, I want that pain that grit that difficulty back. I can feel that fire within me reigniting. I know this is not a way to live for most people and I know that it will be incredibly challenging but the thing about me is I have never been happier to burn because I tasted it before.
            </p>
          </BurningText>

          <p style={{ marginBottom: '4rem' }}>
            The sweetness and the tenderness of someone actually loving you and you can feel it in you heart and goes "oh shoot! this is it. this is what it felt like. i haven't felt like this in a long time".
          </p>

          <motion.div 
            whileHover={{ scale: 1.2, rotate: 2 }}
            animate={{ textShadow: ['0 0 10px #ff0000', '0 0 30px #ff4500', '0 0 10px #ff0000'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ 
              fontSize: 'clamp(4rem, 15vw, 8rem)', // Responsive font size
              fontWeight: 900, 
              textAlign: 'center', 
              color: 'transparent',
              WebkitTextStroke: '2px #ff4500',
              fontFamily: '"Impact", sans-serif',
              cursor: 'default',
              letterSpacing: '10px',
              wordBreak: 'break-all' // Prevent overflow
            }}
          >
            BURN
          </motion.div>

        </div>
      </main>
    </motion.div>
  );
}
