import { Box, Button, Container, Stack, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4A574 0%, #6B4423 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 4,
          }}
        >
          <PetsIcon sx={{ fontSize: 56 }} />
        </Box>
        <Typography variant="h2" sx={{ fontWeight: 800 }}>
          מצא את הכלב המושלם בשבילך
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
          ענה על שאלון קצר ונחשב עבורך אילו גזעי כלבים הכי מתאימים לאורח החיים,
          לבית ולמשפחה שלך - לפי אלגוריתם מדויק על מאגר של מעל 100 גזעים.
        </Typography>
        <Stack direction="row" spacing={3} sx={{ pt: 2 }}>
          <Feature emoji="🎯" label="10 שאלות חכמות" />
          <Feature emoji="🐕" label="100+ גזעים" />
          <Feature emoji="⚡" label="תוצאות מיידיות" />
        </Stack>
        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          sx={{ mt: 2, px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 99 }}
        >
          בוא נתחיל
        </Button>
      </Stack>
    </Container>
  );
}

function Feature({ emoji, label }: { emoji: string; label: string }) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
      <Box sx={{ fontSize: 32 }}>{emoji}</Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}
