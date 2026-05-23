import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuestionCard from './QuestionCard';
import type { AnswerMap, AnswerValue } from '../data/questions';
import { getVisibleQuestions } from '../data/questions';

interface Props {
  onComplete: (answers: AnswerMap) => void;
  onBackToLanding: () => void;
}

export default function Quiz({ onComplete, onBackToLanding }: Props) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [index, setIndex] = useState(0);

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const safeIndex = Math.min(index, visibleQuestions.length - 1);
  const currentQuestion = visibleQuestions[safeIndex];
  const isLast = safeIndex === visibleQuestions.length - 1;
  const currentAnswer = answers[currentQuestion.id];
  const canProceed =
    currentAnswer !== undefined && currentAnswer !== '' ||
    currentQuestion.type === 'slider';

  const progress = ((safeIndex + 1) / visibleQuestions.length) * 100;

  const handleAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion.type === 'slider' && currentAnswer === undefined) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: currentQuestion.defaultValue ?? currentQuestion.min ?? 0,
      }));
    }
    if (isLast) {
      onComplete(answers);
    } else {
      setIndex(safeIndex + 1);
    }
  };

  const handleBack = () => {
    if (safeIndex === 0) {
      onBackToLanding();
    } else {
      setIndex(safeIndex - 1);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Stack
            direction="row"
            sx={{ mb: 1, justifyContent: 'space-between' }}
          >
            <Typography variant="body2" color="text.secondary">
              שאלה {safeIndex + 1} מתוך {visibleQuestions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          value={currentAnswer}
          onChange={handleAnswer}
        />

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 99, px: 3 }}
          >
            {safeIndex === 0 ? 'חזרה' : 'הקודם'}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!canProceed}
            endIcon={<ArrowBackIcon />}
            sx={{ borderRadius: 99, px: 4 }}
          >
            {isLast ? 'גלה את ההתאמה!' : 'הבא'}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
