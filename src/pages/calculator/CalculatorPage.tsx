import { Container, Title, Text, Stack, Space } from '@mantine/core';
import { CalculatorForm } from '../../widgets/calculator-form/CalculatorForm';

export function CalculatorPage() {
  return (
    <Container size="xl" py="xl">
      <Stack align="center" gap="lg">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} size="3rem" fw={900} mb="xs">
            Trading Lot Size Calculator
          </Title>
          <Text size="lg" c="dimmed" maw={600} mx="auto">
            Calculate the optimal lot size for your trades based on your account
            balance, risk tolerance, and trading parameters. Designed for
            professional risk management.
          </Text>
        </div>

        <Space h="md" />

        <CalculatorForm />

        <Space h="xl" />

        <div style={{ textAlign: 'center', maxWidth: '800px' }}>
          <Title order={3} mb="md">
            How to Use the Calculator
          </Title>
          <Text c="dimmed">
            1. <strong>Select your trading symbol</strong> - Choose from XAU/USD
            (Gold), EUR/USD, or GBP/USD
            <br />
            2. <strong>Enter your account balance</strong> - Your total trading
            account size
            <br />
            3. <strong>Set your risk percentage</strong> - How much of your
            account you're willing to risk per trade (typically 1-2%)
            <br />
            4. <strong>Input entry and stop loss prices</strong> - Your planned
            entry point and stop loss level
            <br />
            5. <strong>Calculate</strong> - Get your recommended lot size and
            position details
          </Text>
        </div>
      </Stack>
    </Container>
  );
}
