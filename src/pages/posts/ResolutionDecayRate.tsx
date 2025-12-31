import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowDown, Terminal } from 'lucide-react';

type Specificity = 'vague' | 'smart';
type History = 'failed' | 'never' | 'success';
type ResolutionType = 'health' | 'career' | 'skill' | 'quit';

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function computeProbability(params: { specificity: Specificity; history: History; intensity: number }) {
  const { specificity, history, intensity } = params;

  let baseScore = 15;

  if (specificity === 'smart') baseScore += 25;
  else baseScore -= 5;

  if (history === 'success') baseScore += 20;
  if (history === 'failed') baseScore -= 10;

  const intensityFactor = intensity <= 7 ? intensity * 2 : 14 - (intensity - 7) * 4;
  baseScore += intensityFactor;

  return clampNumber(Math.round(baseScore), 1, 99);
}

function calculateDaysUntilSlip(probability: number) {
  if (probability > 80) return '45+';
  const days = Math.round((probability / 100) * 40) + 2;
  return `${days} days`;
}

function generateDeterministicPath(probability: number) {
  const width = 300;
  const height = 150;
  const decayRate = (100 - probability) / 100;

  const points: string[] = [];
  for (let x = 0; x <= width; x += 10) {
    const normalizedX = x / width;
    const noise = Math.sin((x + probability) * 0.18) * 2.5;
    const drop = normalizedX * normalizedX * (150 * decayRate * 1.5);
    const y = clampNumber(drop + noise, 0, height);
    points.push(`${x},${y}`);
  }

  return `M0,0 L${points.join(' L')}`;
}

function ActionCardButton(props: {
  title: string;
  description?: string;
  active: boolean;
  onClick: () => void;
}) {
  const { title, description, active, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        border: '2px solid #000',
        padding: '1rem',
        width: '100%',
        textAlign: 'left',
        background: active ? '#000' : '#fff',
        color: active ? '#fff' : '#000',
        transform: active ? 'translate(2px, 2px)' : undefined,
        boxShadow: active ? 'none' : '4px 4px 0px 0px rgba(0,0,0,1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {title}
        </div>
        {active ? <span style={{ fontWeight: 900 }}>✓</span> : null}
      </div>
      {description ? (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: active ? 0.75 : 0.65, lineHeight: 1.35 }}>
          {description}
        </div>
      ) : null}
    </button>
  );
}

export default function ResolutionDecayRate() {
  const [resolutionType, setResolutionType] = useState<ResolutionType>('health');
  const [intensity, setIntensity] = useState(5);
  const [history, setHistory] = useState<History>('failed');
  const [specificity, setSpecificity] = useState<Specificity>('vague');
  const [showResults, setShowResults] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const probability = useMemo(
    () => computeProbability({ specificity, history, intensity }),
    [history, intensity, specificity]
  );

  const resolutionTypeLabel = useMemo(() => {
    switch (resolutionType) {
      case 'health':
        return 'Health / Body';
      case 'career':
        return 'Career / Money';
      case 'skill':
        return 'New Skill';
      case 'quit':
        return 'Quit Habit';
    }
  }, [resolutionType]);

  const slipDays = useMemo(() => calculateDaysUntilSlip(probability), [probability]);

  const graphPath = useMemo(() => generateDeterministicPath(probability), [probability]);

  const runSimulation = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);

    setCalculating(true);
    setProgress(0);
    setShowResults(false);

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10 + Math.random() * 12;
        if (next >= 100) {
          if (timerRef.current !== null) window.clearInterval(timerRef.current);
          timerRef.current = null;
          setCalculating(false);
          setShowResults(true);
          return 100;
        }
        return next;
      });
    }, 110);
  };

  const resetSimulation = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setCalculating(false);
    setProgress(0);
    setShowResults(false);
  };

  const panelStyle: React.CSSProperties = {
    border: '4px solid #000',
    background: '#fff',
    boxShadow: '12px 12px 0px 0px #ff4d00'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f0', color: '#000', paddingBottom: '4rem' }}>
      <div style={{ borderBottom: '4px solid #000', background: '#000' }}>
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#000',
              border: '2px solid #fff',
              padding: '0.6rem 0.85rem',
              fontWeight: 950,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              boxShadow: '4px 4px 0px 0px #ff4d00'
            }}
          >
            ← Back Home
          </Link>
          <div style={{ color: '#fff', fontWeight: 900, letterSpacing: '0.18em', fontSize: '0.7rem', opacity: 0.85 }}>
            KIEZZTHOUGHT
          </div>
        </div>
      </div>

      <header style={{ borderBottom: '4px solid #000', background: '#ff4d00', padding: '3rem 1.5rem 2.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              border: '1px solid #000',
              padding: '0.25rem 0.5rem',
              background: '#fff',
              boxShadow: '2px 2px 0px 0px #000',
              fontWeight: 800,
              letterSpacing: '0.18em',
              fontSize: '0.7rem'
            }}
          >
            DATA SIMULATION v2.0.25
          </div>

          <h1
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
              fontWeight: 950,
              lineHeight: 0.88,
              letterSpacing: '-0.06em',
              textTransform: 'uppercase',
              fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif'
            }}
          >
            The Resolution
            <br />
            Decay Rate
          </h1>

          <div style={{ marginTop: '1rem', maxWidth: 520, borderLeft: '4px solid #000', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>It’s not motivational garbage. It’s math.</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <section style={{ marginTop: '1.25rem', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
          <p>
            <span style={{ float: 'left', fontWeight: 950, fontSize: '3rem', lineHeight: 1, marginRight: '0.5rem' }}>J</span>
            anuary 1st is an arbitrary temporal landmark. Our brains love these. We call it the{' '}
            <span style={{ background: '#000', color: '#fff', padding: '0.1rem 0.3rem', fontWeight: 800, fontSize: '0.85rem' }}>
              Fresh Start Effect
            </span>
            . It separates our &quot;past imperfect self&quot; from our &quot;future idealized self.&quot;
          </p>

          <p style={{ marginTop: '1rem' }}>
            The problem? The future self is a fiction. The person who wakes up on January 1st is the same biological
            machine that went to sleep on December 31st, just hungover and facing a daunting regression to the mean.
          </p>

          <div
            style={{
              margin: '2.25rem 0',
              border: '2px solid #000',
              padding: '1.25rem',
              background: '#fff',
              boxShadow: '8px 8px 0px 0px #000',
              transform: 'rotate(0.6deg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
              <AlertTriangle size={16} />
              <div style={{ fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                Fact Check
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontWeight: 950, fontSize: '1.8rem' }}>
              80% of resolutions fail by the second week of February.
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.65 }}>
              Source: U.S. News &amp; World Report
            </div>
          </div>

          <p>
            We built a model to simulate your specific failure trajectory. We don&apos;t use &quot;hope.&quot; We use
            behavioral variables: <strong>Specificity</strong>, <strong>Past History</strong> (Bayesian prior), and{' '}
            <strong>Intensity</strong> (burnout coefficient).
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.75rem' }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
              <ArrowDown size={40} />
            </motion.div>
          </div>
        </section>

        <section style={{ ...panelStyle, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: '#000', color: '#fff', padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontWeight: 900 }}>
            INTERACTIVE_MOD_01
          </div>

          <h2 style={{ fontSize: '1.9rem', fontWeight: 950, textTransform: 'uppercase', borderBottom: '4px solid #000', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            The Reality Engine
          </h2>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                1. Target Vector (Category)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                <ActionCardButton title="Health / Body" active={resolutionType === 'health'} onClick={() => setResolutionType('health')} />
                <ActionCardButton title="Career / Money" active={resolutionType === 'career'} onClick={() => setResolutionType('career')} />
                <ActionCardButton title="New Skill" active={resolutionType === 'skill'} onClick={() => setResolutionType('skill')} />
                <ActionCardButton title="Quit Habit" active={resolutionType === 'quit'} onClick={() => setResolutionType('quit')} />
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                2. Definition Clarity
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <ActionCardButton
                  title="Vague Idea"
                  description="“I want to get fit” or “Save more money”"
                  active={specificity === 'vague'}
                  onClick={() => setSpecificity('vague')}
                />
                <ActionCardButton
                  title="S.M.A.R.T. Goal"
                  description="“Run 5k in <25mins by March” or “Save $200/mo”"
                  active={specificity === 'smart'}
                  onClick={() => setSpecificity('smart')}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                <span>3. Intensity Level</span>
                <span style={{ background: '#000', color: '#fff', padding: '0.1rem 0.5rem' }}>{intensity}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(Number.parseInt(e.target.value, 10))}
                style={{ width: '100%', marginTop: '0.75rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem', opacity: 0.7 }}>
                <span>Lazy</span>
                <span>Sustainable</span>
                <span>Burnout Zone</span>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                4. Historical Data
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <ActionCardButton title="Tried & Failed Before" active={history === 'failed'} onClick={() => setHistory('failed')} />
                <ActionCardButton title="First Attempt" active={history === 'never'} onClick={() => setHistory('never')} />
                <ActionCardButton title="Consistent Success" active={history === 'success'} onClick={() => setHistory('success')} />
              </div>
            </div>

            <button
              type="button"
              onClick={runSimulation}
              disabled={calculating}
              style={{
                width: '100%',
                background: calculating ? '#111' : '#000',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 900,
                padding: '1.25rem',
                border: '2px solid transparent',
                cursor: calculating ? 'not-allowed' : 'pointer',
                opacity: calculating ? 0.6 : 1
              }}
            >
              {calculating ? `SIMULATING... ${Math.round(progress)}%` : 'RUN SIMULATION'}
            </button>
          </div>
        </section>

        {showResults ? (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ marginTop: '2rem' }}
          >
            <div style={{ background: '#ff4d00', border: '4px solid #000', padding: '0.35rem' }}>
              <div style={{ background: '#fff', border: '2px solid #000', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid #000', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  <Terminal size={28} />
                  <div style={{ fontWeight: 950, fontSize: '1.35rem', textTransform: 'uppercase' }}>Simulation Output</div>
                </div>

                <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', opacity: 0.75 }}>
                  Target Vector: <strong>{resolutionTypeLabel}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.65, fontWeight: 800 }}>Success Probability</div>
                    <div style={{ fontSize: '3.25rem', fontWeight: 950, letterSpacing: '-0.04em' }}>{probability}%</div>
                    <div style={{ marginTop: '0.35rem', fontWeight: 800 }}>
                      {probability < 20
                        ? 'Outlook: Grim.'
                        : probability < 50
                          ? 'Outlook: Coin Toss.'
                          : probability < 80
                            ? 'Outlook: Promising.'
                            : 'Outlook: Statistical Anomaly.'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.65, fontWeight: 800 }}>Est. Time to Relapse</div>
                    <div style={{ fontSize: '3.25rem', fontWeight: 950, letterSpacing: '-0.04em' }}>{slipDays}</div>
                    <div style={{ marginTop: '0.35rem', fontWeight: 800 }}>Until the “ah, screw it” moment.</div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', border: '4px solid #000', background: '#fafafa', padding: '1rem' }}>
                  <div style={{ display: 'inline-block', background: '#000', color: '#fff', fontSize: '0.7rem', fontWeight: 900, padding: '0.15rem 0.4rem' }}>
                    MOTIVATION CURVE
                  </div>
                  <div style={{ marginTop: '0.75rem', height: 230 }}>
                    <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 300 150">
                      <line x1="0" y1="37.5" x2="300" y2="37.5" stroke="#ddd" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="75" x2="300" y2="75" stroke="#ddd" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="112.5" x2="300" y2="112.5" stroke="#ddd" strokeWidth="1" strokeDasharray="4 4" />

                      <path d={graphPath} fill="none" stroke="#000" strokeWidth="4" strokeLinecap="square" />
                      <path d={`${graphPath} L300,150 L0,150 Z`} fill="#ff4d00" opacity={0.2} />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.65 }}>
                      <span>JAN 1</span>
                      <span>FEB 1</span>
                      <span>MAR 1</span>
                      <span>APR 1</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', borderTop: '2px solid #000', paddingTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.55 }}>
                  <strong>The Analysis:</strong> Your intensity score of {intensity}/10 combined with your past history
                  suggests a {probability > 50 ? 'resilient' : 'fragile'} habit structure.
                  {specificity === 'vague'
                    ? ' Your lack of specificity is the primary failure point. “Getting fit” is a wish; “Gym at 6am” is a plan.'
                    : null}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={resetSimulation}
                    style={{ padding: '0.6rem 0.9rem', border: '2px solid #000', background: '#fff', fontWeight: 900, cursor: 'pointer' }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        ) : null}

        <section style={{ marginTop: '3.25rem', borderTop: '8px solid #000', paddingTop: '2rem' }}>
          <h3 style={{ fontWeight: 950, fontSize: '2rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Why you (probably) failed
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ borderLeft: '4px solid #ff4d00', paddingLeft: '1rem' }}>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                Ego Depletion
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.55 }}>
                Willpower acts like a muscle. It gets tired. If you try to change your diet, your sleep, and your
                career all at once (High Intensity), you deplete your cognitive resources by 2 PM.
              </div>
            </div>

            <div style={{ borderLeft: '4px solid #ff4d00', paddingLeft: '1rem' }}>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                The What-The-Hell Effect
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.55 }}>
                Dieting researchers coined this. Once you slip slightly (eat one cookie), your brain says “Day ruined,
                might as well eat the box.” Perfectionism is the enemy of consistency.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.25rem', padding: '2rem', background: '#000', color: '#fff', textAlign: 'center' }}>
            <div style={{ fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '1.25rem' }}>
              Want to beat the odds?
            </div>
            <div style={{ marginTop: '0.75rem', opacity: 0.9 }}>Lower the bar. Do less. Be mediocre, consistently.</div>
            <button
              type="button"
              onClick={resetSimulation}
              style={{ marginTop: '1.25rem', padding: '0.75rem 1.2rem', background: '#ff4d00', color: '#000', fontWeight: 950, border: '2px solid transparent', cursor: 'pointer' }}
            >
              RESET SIMULATION
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.55, marginTop: '1rem' }}>
            © 2025 THE REALITY CHECK PROJECT. NO COOKIES. NO TRACKING. JUST JUDGMENT.
          </div>
        </section>
      </main>
    </div>
  );
}
