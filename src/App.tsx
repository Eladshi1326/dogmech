import { useState } from 'react';
import { Box } from '@mui/material';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { matchBreeds } from './lib/matcher';
import type { MatchResult } from './lib/matcher';
import type { AnswerMap } from './data/questions';

type Screen = 'landing' | 'quiz' | 'results';

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [results, setResults] = useState<MatchResult[]>([]);

  const handleStart = () => setScreen('quiz');

  const handleComplete = (answers: AnswerMap) => {
    setResults(matchBreeds(answers, 3));
    setScreen('results');
  };

  const handleRestart = () => {
    setResults([]);
    setScreen('landing');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FBF7F2 0%, #F0E4D2 100%)',
      }}
    >
      {screen === 'landing' && <Landing onStart={handleStart} />}
      {screen === 'quiz' && (
        <Quiz onComplete={handleComplete} onBackToLanding={handleRestart} />
      )}
      {screen === 'results' && (
        <Results results={results} onRestart={handleRestart} />
      )}
    </Box>
  );
}

export default App;
