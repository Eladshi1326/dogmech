import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { MatchResult } from '../lib/matcher';
import { useDogImage } from '../lib/useDogImage';

const placeholderImage = (name: string) =>
  'https://placehold.co/400x260/D4A574/FFFFFF?text=' + encodeURIComponent(name);

interface Props {
  result: MatchResult;
  rank: number;
}

const RANK_COLORS = ['#D4A574', '#B0B0B0', '#CD853F'];
const RANK_LABELS = ['התאמה ראשונה', 'התאמה שנייה', 'התאמה שלישית'];

export default function BreedCard({ result, rank }: Props) {
  const { breed, score, reasons } = result;
  const isWinner = rank === 0;
  const imageHeight = isWinner ? 260 : 200;
  const { url, loading } = useDogImage(breed.dogCeoSlug);
  const displayUrl = url ?? placeholderImage(breed.nameHe);

  return (
    <Card
      elevation={isWinner ? 6 : 2}
      sx={{
        borderRadius: 4,
        border: isWinner ? 3 : 0,
        borderColor: 'primary.main',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {loading ? (
          <Skeleton
            variant="rectangular"
            height={imageHeight}
            animation="wave"
          />
        ) : (
          <CardMedia
            component="img"
            height={imageHeight}
            image={displayUrl}
            alt={breed.nameHe}
            sx={{ objectFit: 'cover', bgcolor: '#eee' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholderImage(breed.nameHe);
            }}
          />
        )}
        <Chip
          label={RANK_LABELS[rank]}
          sx={{
            position: 'absolute',
            top: 12,
            insetInlineStart: 12,
            bgcolor: RANK_COLORS[rank],
            color: 'white',
            fontWeight: 700,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            insetInlineEnd: 12,
            bgcolor: 'rgba(0,0,0,0.75)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 99,
            fontWeight: 700,
            fontSize: '1.1rem',
          }}
        >
          {score}% התאמה
        </Box>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {breed.nameHe}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ direction: 'ltr', textAlign: 'right' }}
            >
              {breed.nameEn}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.primary">
            {breed.description}
          </Typography>

          <Stack direction="row" sx={{ pt: 1, flexWrap: 'wrap', gap: 1 }}>
            {reasons.map((r, i) => (
              <Chip
                key={i}
                icon={<CheckCircleIcon />}
                label={r.textHe}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ pt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Stat label="גודל" value={breed.size} max={5} />
            <Stat label="אנרגיה" value={breed.energy} max={5} />
            <Stat label="טיפוח" value={breed.groomingEffort} max={5} />
            <Stat label="תוחלת חיים" value={`${breed.lifespanYears} שנים`} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  max,
}: {
  label: string;
  value: number | string;
  max?: number;
}) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {max ? `${value}/${max}` : value}
      </Typography>
    </Box>
  );
}
