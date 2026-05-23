import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import BreedCard from './BreedCard';
import type { MatchResult } from '../lib/matcher';

interface Props {
  results: MatchResult[];
  onRestart: () => void;
}

export default function Results({ results, onRestart }: Props) {
  if (results.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5">לא נמצאו התאמות. נסה שוב.</Typography>
        <Button onClick={onRestart} sx={{ mt: 2 }}>
          התחל מחדש
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            הנה הכלבים הכי מתאימים לך 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary">
            על פי התשובות שלך, אלה שלושת הגזעים שהכי מתאימים לאורח החיים שלך:
          </Typography>
        </Box>

        <Stack spacing={3}>
          {results.map((result, i) => (
            <BreedCard key={result.breed.id} result={result} rank={i} />
          ))}
        </Stack>

        <Box sx={{ pt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ReplayIcon />}
            onClick={onRestart}
            sx={{ borderRadius: 99, px: 4 }}
          >
            התחל שאלון מחדש
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ pt: 2, textAlign: 'center', display: 'block' }}
        >
          ההמלצות מבוססות על מאפייני גזעים כלליים. כל כלב הוא יחיד במינו - מומלץ
          לפגוש את הכלב לפני אימוץ.
        </Typography>
      </Stack>
    </Container>
  );
}
