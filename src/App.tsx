import { MantineProvider } from './app/providers/MantineProvider';
import { Header, Footer } from './shared/ui';
import { CalculatorPage } from './pages/calculator/CalculatorPage';
import { AppShell } from '@mantine/core';

function App() {
  return (
    <MantineProvider>
      <AppShell header={{ height: 70 }} footer={{ height: 80 }} padding="md">
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        <AppShell.Main>
          <CalculatorPage />
        </AppShell.Main>

        <AppShell.Footer pos="static">
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
