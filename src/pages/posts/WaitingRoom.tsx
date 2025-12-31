import { useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Coffee, Smartphone, Car, X } from 'lucide-react';

const LIFESPAN_YEARS = 80;

function calculateYearsFromDailyMinutes(dailyMinutes: number) {
  return (dailyMinutes * LIFESPAN_YEARS) / (60 * 24);
}

type RangeControlProps = {
  label: string;
  icon: ComponentType<{ size?: number }>;
  value: number;
  setValue: (next: number) => void;
  max: number;
  suffix: string;
  commentary: (val: number) => ReactNode;
};

function RangeControl({ label, icon: Icon, value, setValue, max, suffix, commentary }: RangeControlProps) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#000', color: '#fff', padding: '0.5rem' }}>
          <Icon size={24} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          {label}
        </h3>
      </div>

      <div
        style={{
          background: '#fff',
          border: '4px solid #000',
          padding: '1.5rem',
          boxShadow: '8px 8px 0 #000',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{value}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#666' }}>{suffix}</span>
        </div>

        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#000',
            cursor: 'pointer'
          }}
        />

        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '2px dashed #000',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '0.9rem'
          }}
        >
          {commentary(value)}
        </div>

        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            pointerEvents: 'none',
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '10px 10px'
          }}
        />
      </div>
    </div>
  );
}

export default function WaitingRoom() {
  const [commute, setCommute] = useState(30);
  const [doomscrolling, setDoomscrolling] = useState(60);
  const [queuing, setQueuing] = useState(15);

  const stats = useMemo(() => {
    const sleepYears = 26;
    const workYears = 13;
    const choreYears = 4;

    const commuteYears = calculateYearsFromDailyMinutes(commute);
    const scrollYears = calculateYearsFromDailyMinutes(doomscrolling);
    const queueYears = calculateYearsFromDailyMinutes(queuing);

    const totalWaitingYears = commuteYears + scrollYears + queueYears;
    const livingYears = LIFESPAN_YEARS - (sleepYears + workYears + choreYears + totalWaitingYears);

    return {
      sleep: sleepYears,
      work: workYears,
      chores: choreYears,
      commute: commuteYears,
      scroll: scrollYears,
      queue: queueYears,
      waiting: totalWaitingYears,
      living: Math.max(0, livingYears)
    };
  }, [commute, doomscrolling, queuing]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f0', color: '#000' }}>
      <nav style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 20 }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            background: '#fff',
            border: '2px solid #000',
            padding: '0.5rem 0.75rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.75rem',
            boxShadow: '4px 4px 0 #000'
          }}
        >
          &larr; Back Home
        </Link>
      </nav>

      <header
        style={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          position: 'relative',
          borderBottom: '8px solid #000',
          background: '#facc15'
        }}
      >
        <div style={{ maxWidth: 900, width: '100%' }}>
          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 950,
              textTransform: 'uppercase',
              letterSpacing: '-0.06em',
              lineHeight: 0.85,
              marginBottom: '2rem',
              textShadow: '4px 4px 0 #fff'
            }}
          >
            The <br />
            Waiting <br />
            Room
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: 900,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              maxWidth: 520,
              background: '#fff',
              border: '4px solid #000',
              padding: '1rem',
              display: 'inline-block',
              boxShadow: '8px 8px 0 #000'
            }}
          >
            How much of your existence is actually yours?
          </p>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '2rem' }}
        >
          <div
            style={{
              border: '2px solid #000',
              borderRadius: 9999,
              padding: '0.25rem',
              background: '#fff'
            }}
          >
            <ArrowDown size={40} />
          </div>
        </motion.div>
      </header>

      <main style={{ maxWidth: 880, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
        <section
          style={{
            margin: '5rem 0',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '1.05rem',
            lineHeight: 1.85
          }}
        >
          <p style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                display: 'inline-block',
                background: '#000',
                color: '#fff',
                padding: '0 0.5rem',
                fontWeight: 900,
                fontSize: '1.25rem',
                marginRight: '0.5rem'
              }}
            >
              F
            </span>
            or the average human, life is not a continuous stream of events. It is a series of gaps. We wait for the
            train. We wait for the kettle. We wait for the "Skip Ad" button.
          </p>
          <p style={{ marginBottom: 0 }}>
            These moments feel trivial. A minute here, five minutes there. They are the crumbs of time we sweep under
            the rug. But crumbs attract pests. And in this case, the pest is{' '}
            <span style={{ textDecoration: 'underline', textDecorationThickness: '4px', textDecorationColor: '#facc15' }}>
              mortality
            </span>
            .
          </p>
        </section>

        <RangeControl
          label="The Commute"
          icon={Car}
          value={commute}
          setValue={setCommute}
          max={180}
          suffix="Minutes / Day"
          commentary={(val) => {
            const years = calculateYearsFromDailyMinutes(val).toFixed(1);
            if (val === 0) return 'You work from home? You lucky ghost.';
            if (val < 20) return `Manageable. That's only ${years} years of staring at asphalt.`;
            if (val < 60) return `Standard misery. You will spend ${years} years in transit.`;
            return `Ouch. ${years} years lost. You could have learned Mandarin 4 times over.`;
          }}
        />

        <RangeControl
          label="The Digital Void"
          icon={Smartphone}
          value={doomscrolling}
          setValue={setDoomscrolling}
          max={300}
          suffix="Minutes / Day"
          commentary={(val) => {
            const years = calculateYearsFromDailyMinutes(val).toFixed(1);
            if (val < 30) return 'A disciplined mind. Or a liar.';
            if (val < 120) return `Average. ${years} years feeding the algorithm.`;
            return `The abyss stares back. ${years} years of your life belong to Mark Zuckerberg.`;
          }}
        />

        <RangeControl
          label="The Queue"
          icon={Coffee}
          value={queuing}
          setValue={setQueuing}
          max={60}
          suffix="Minutes / Day"
          commentary={(val) => {
            const years = calculateYearsFromDailyMinutes(val).toFixed(1);
            return `Lines, elevators, microwaves, holding music. ${years} years of pure, unadulterated nothingness.`;
          }}
        />

        <section style={{ margin: '8rem 0 6rem' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 950,
              textTransform: 'uppercase',
              marginBottom: '2rem',
              borderBottom: '4px solid #000',
              display: 'inline-block'
            }}
          >
            The 80-Year Pie
          </h2>

          <div style={{ background: '#fff', border: '4px solid #000', padding: '1rem', boxShadow: '12px 12px 0 #000' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '4px',
                marginBottom: '1.5rem',
                aspectRatio: '10 / 8'
              }}
            >
              {Array.from({ length: LIFESPAN_YEARS }).map((_, i) => {
                let backgroundColor = '#f5f5f5';
                let type: 'sleep' | 'work' | 'chores' | 'waiting' | 'living' = 'living';

                let counter = i;
                if (counter < stats.sleep) {
                  backgroundColor = '#cbd5e1';
                  type = 'sleep';
                } else {
                  counter -= stats.sleep;
                  if (counter < stats.work) {
                    backgroundColor = '#93c5fd';
                    type = 'work';
                  } else {
                    counter -= stats.work;
                    if (counter < stats.chores) {
                      backgroundColor = '#fed7aa';
                      type = 'chores';
                    } else {
                      counter -= stats.chores;
                      if (counter < stats.commute) {
                        backgroundColor = '#f87171';
                        type = 'waiting';
                      } else {
                        counter -= stats.commute;
                        if (counter < stats.scroll) {
                          backgroundColor = '#c4b5fd';
                          type = 'waiting';
                        } else {
                          counter -= stats.scroll;
                          if (counter < stats.queue) {
                            backgroundColor = '#facc15';
                            type = 'waiting';
                          }
                        }
                      }
                    }
                  }
                }

                return (
                  <div
                    key={i}
                    title={`Year ${i + 1}: ${type.toUpperCase()}`}
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      border: '1px solid rgba(0,0,0,0.12)',
                      backgroundColor
                    }}
                  />
                );
              })}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, background: '#cbd5e1', border: '1px solid #000' }} />
                <span>Sleep ({stats.sleep}y)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, background: '#93c5fd', border: '1px solid #000' }} />
                <span>Work ({stats.work}y)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, background: '#fed7aa', border: '1px solid #000' }} />
                <span>Chores ({stats.chores}y)</span>
              </div>

              <div
                style={{
                  gridColumn: '1 / -1',
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px dashed rgba(0,0,0,0.35)',
                  fontWeight: 900
                }}
              >
                THE WAITING ({stats.waiting.toFixed(1)}y):
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, background: '#f87171', border: '1px solid #000' }} />
                <span>Traffic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, background: '#c4b5fd', border: '1px solid #000' }} />
                <span>Phone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, background: '#facc15', border: '1px solid #000' }} />
                <span>Queues</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{ margin: '6rem 0', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem' }}>THE VERDICT</h3>

          <div
            style={{
              display: 'inline-block',
              border: '4px solid #000',
              padding: '2rem',
              background: '#000',
              color: '#fff',
              boxShadow: '8px 8px 0 #666'
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              }}
            >
              Time Remaining For Actual Living
            </p>
            <div style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', fontWeight: 950, color: '#facc15', lineHeight: 1 }}>
              {stats.living.toFixed(1)}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.08em' }}>YEARS</div>
          </div>

          <p
            style={{
              marginTop: '2rem',
              maxWidth: 560,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }}
          >
            {stats.living < 20
              ? 'You are running on fumes. Put the phone down. Seriously.'
              : "You have time. But do not mistake 'having time' for 'living'."}
          </p>
        </section>

        <footer
          style={{
            borderTop: '4px solid #000',
            paddingTop: '2.5rem',
            paddingBottom: '4rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '0.9rem'
          }}
        >
          <p style={{ marginBottom: '1rem' }}>
            <span style={{ fontWeight: 900, background: '#fde047', padding: '0 0.25rem' }}>NOTE:</span> This model
            assumes you live to 80. It assumes you don't get sick. It assumes the world doesn't end.
          </p>
          <p style={{ marginBottom: '2.5rem' }}>
            The only variable you control is the <span style={{ color: '#ef4444', fontWeight: 900 }}>Waiting</span>.
            You cannot stop sleeping. You (probably) cannot stop working. But you can stop doomscrolling.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/"
              style={{
                background: '#fff',
                border: '2px solid #000',
                padding: '0.65rem 1.25rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <X size={16} /> Close Simulation
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

