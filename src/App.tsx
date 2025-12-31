import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import WaitingForTrain from './pages/posts/WaitingForTrain';
import Obsession from './pages/posts/Obsession';
import WaitingRoom from './pages/posts/WaitingRoom';
import ChaosEngine from './pages/posts/ChaosEngine';
import ResolutionDecayRate from './pages/posts/ResolutionDecayRate';
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/resolution-decay-rate" element={<ResolutionDecayRate />} />
        <Route path="/post/waiting-for-train" element={<WaitingForTrain />} />
        <Route path="/post/obsession" element={<Obsession />} />
        <Route path="/post/waiting-room" element={<WaitingRoom />} />
        <Route path="/post/chaos-engine" element={<ChaosEngine />} />
      </Routes>
    </Router>
  );
}

export default App;
