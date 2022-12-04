import AppBar from '@mui/material/AppBar';
import GradingIcon from '@mui/icons-material/Grading';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import './App.css';
import { AppFooter } from './Components/AppFooter';
import { IC2Provider } from './Misc/IC2Provider';
import { C2SetupView } from './Components/C2SetupView';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
  const [c2Provider, setC2Provider] = useState<IC2Provider | null>(null);
  const [c2Profile, setC2Profile] = useState<any | null>(null);

  const getView = () => {
    if (!c2Provider || !c2Profile) return <C2SetupView onSetupDone={(provider, profile) => { setC2Provider(provider); setC2Profile(profile); }} />
    else return c2Provider?.editView({ "profile": c2Profile, "onProfileChanged": (p:any)=>setC2Profile(p) });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <GradingIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              c2profiler
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <main>
        <Container>
          {/* Current View */}
          {getView()}
          {/* End */}
        </Container>
      </main>
      {/* Footer */}
      <AppFooter />
      {/* End footer */}
    </ThemeProvider>
  );
}

export default App;
