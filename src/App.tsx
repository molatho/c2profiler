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

const styles = {
  appTitle: {
    align: "center"
  }
}

function App() {
  const [c2Provider, setC2Provider] = useState<IC2Provider | null>(null);
  const [c2Profile, setC2Profile] = useState<any | null>(null);

  const inSetup = !c2Provider || !c2Profile;

  const handleSetupDone = (provider: IC2Provider, profile: any) => {
    setC2Provider(provider);
    setC2Profile(profile);
  }

  const getEditView = () => {
    if (c2Provider) {
      const EditView: (profile: any, onProfileChanged: (profile: any) => void) => JSX.Element = c2Provider && c2Provider.editView;
      return <EditView profile={c2Profile} onProfileChanged={setC2Profile} />
    }
    return <></>
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative" className="App-Title-Container">
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
          {inSetup
            ? <C2SetupView onSetupDone={handleSetupDone} />
            : getEditView()
          }
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
