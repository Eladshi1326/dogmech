import {
  Box,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import type { Question, AnswerValue } from '../data/questions';

interface Props {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

export default function QuestionCard({ question, value, onChange }: Props) {
  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {question.textHe}
            </Typography>
            {question.helperHe && (
              <Typography variant="body2" color="text.secondary">
                {question.helperHe}
              </Typography>
            )}
          </Box>

          {question.type === 'single' && question.options && (
            <RadioGroup
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
            >
              <Stack spacing={1.5}>
                {question.options.map((opt) => (
                  <FormControlLabel
                    key={opt.value}
                    value={opt.value}
                    control={<Radio />}
                    label={opt.labelHe}
                    sx={{
                      m: 0,
                      p: 1.5,
                      border: 1,
                      borderColor:
                        value === opt.value ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      bgcolor:
                        value === opt.value
                          ? 'rgba(107,68,35,0.06)'
                          : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': { bgcolor: 'rgba(107,68,35,0.04)' },
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1rem',
                        fontWeight: 500,
                      },
                    }}
                  />
                ))}
              </Stack>
            </RadioGroup>
          )}

          {question.type === 'slider' && (
            <Box sx={{ px: 2, pt: 1 }}>
              <Slider
                value={
                  typeof value === 'number'
                    ? value
                    : (question.defaultValue ?? question.min ?? 0)
                }
                min={question.min}
                max={question.max}
                step={question.step}
                marks
                valueLabelDisplay="on"
                valueLabelFormat={(v) => `${v} שעות`}
                onChange={(_, v) => onChange(v as number)}
                sx={{ mt: 4 }}
              />
              <Stack
                direction="row"
                sx={{ mt: 1, justifyContent: 'space-between' }}
              >
                <Typography variant="caption" color="text.secondary">
                  {question.min} שעות
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {question.max} שעות
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
