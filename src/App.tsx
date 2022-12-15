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
import { IC2Provider, Section } from './Misc/IC2Provider';
import { C2SetupView } from './Components/C2SetupView';
import { AppFlow } from './Misc/Common';
import { AppNavigation } from './Components/AppNavigation';
import { Logo } from './Components/Misc/Logo';

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

const START_SECTION: Section = {
  title: "Malleable Profile Setup",
  description: "Welcome to c2profiler! This tool allows you to import, view, edit, export, lint, and (somewhat) test your malleable profiles. In this first step you'll import or create the profile to work on."
}

function App() {
  const [c2Provider, setC2Provider] = useState<IC2Provider | null>(null);
  const [c2Profile, setC2Profile] = useState<any | null>(null);
  const [step, setStep] = useState<AppFlow>("setup");

  const inSetup = !c2Provider || !c2Profile;

  const handleSetupDone = (provider: IC2Provider, profile: any) => {
    setC2Provider(provider);
    setC2Profile(profile);
    setStep("edit");
  }

  const getSection = (): Section | undefined => {
    switch (step) {
      case "setup":
        return START_SECTION;
      case "edit":
        return c2Provider?.editView;
      case "test":
        return c2Provider?.testView;
      case "export":
        return c2Provider?.exportView;
    }
  }

  const current_section = getSection();

  const getEditView = () => {
    if (c2Provider) {
      const EditView: (profile: any, onProfileChanged: (profile: any) => void) => JSX.Element = c2Provider && c2Provider.editView.view;
      return <EditView profile={c2Profile} onProfileChanged={setC2Profile} />
    }
    return <></>
  }

  const getTestView = () => {
    if (c2Provider) {
      const TestView: (profile: any) => JSX.Element = c2Provider && c2Provider.testView.view;
      return <TestView profile={c2Profile} />
    }
    return <></>
  }

  const getExportView = () => {
    if (c2Provider) {
      const ExportView: (profile: any) => JSX.Element = c2Provider && c2Provider.exportView.view;
      return <ExportView profile={c2Profile} />
    }
    return <></>
  }

  const getView = (): JSX.Element => {
    switch (step) {
      case "setup":
        return <C2SetupView onSetupDone={handleSetupDone} />;
      case "edit":
        return getEditView();
      case "test":
        return getTestView();
      case "export":
        return getExportView();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative" className="App-Title-Container">
        <Toolbar>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Logo />
          </Stack>
        </Toolbar>
      </AppBar>
      <main>
        <Container>
          {/* Flow Navigation */}
          {current_section &&
            <AppNavigation section={current_section} step={step} setStep={setStep} progressBlocked={step == "setup" && (!c2Provider || !c2Profile)} />}
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
