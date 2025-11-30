import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HoverDef from '../../components/HoverDef';

export default function Optimistic() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f4f8',
      color: '#333',
      fontFamily: '"Nunito", sans-serif', // Assuming system font fallbacks will handle this nicely
      overflowX: 'hidden'
    }}>
      {/* Custom Navigation for this page */}
      <nav style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>&larr; Back to Reality</Link>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%', background: '#fda085' 
        }} />
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ 
            fontSize: '4rem', 
            lineHeight: 1, 
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900
          }}
        >
          Sunshine in a Bottle.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ fontSize: '1.25rem', lineHeight: 1.8 }}
        >
          <p style={{ marginBottom: '1.5rem' }}>
            Sometimes, the world feels a bit too heavy. The news cycle spins, the 
            <HoverDef 
              word="cacophony" 
              definition="A harsh, discordant mixture of sounds." 
              pronunciation="/kəˈkäfənē/"
              usage="The cacophony of the city streets overwhelmed him."
            /> of social media never ends, and you just want to crawl under a rock.
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            But then, you see it. A small <HoverDef word="serendipity" definition="The occurrence of events by chance in a happy or beneficial way." color="#f6d365" />. Maybe it's the way the light hits your coffee cup in the morning. Or a stranger smiling at a dog.
          </p>

          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '20px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            margin: '3rem 0',
            borderLeft: '10px solid #fda085'
          }}>
            <h3 style={{ color: '#fda085', marginBottom: '1rem' }}>Thought of the Day</h3>
            <p style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>
              "Optimism isn't ignoring the bad. It's acknowledging the bad, but choosing to focus on the good anyway."
            </p>
          </div>

          <p>
            So today, I challenge you. Find one small thing. One tiny, insignificant thing that makes you smile. Hold onto it. That's your anchor. That's your spark.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
