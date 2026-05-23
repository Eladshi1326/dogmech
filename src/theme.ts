import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export const rtlCache = createCache({
  key: 'mui-rtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Heebo", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  palette: {
    mode: 'light',
    primary: { main: '#6B4423' },
    secondary: { main: '#D4A574' },
    background: {
      default: '#FBF7F2',
      paper: '#FFFFFF',
    },
  },
  shape: { borderRadius: 14 },
});
