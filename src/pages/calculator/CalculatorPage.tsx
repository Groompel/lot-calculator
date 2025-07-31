import { Container, Title, Text, Stack, Space } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { CalculatorForm } from '../../widgets/calculator-form/CalculatorForm';

export function CalculatorPage() {
  const { t } = useTranslation();

  return (
    <Container size="xl" py="xl">
      <Stack align="center" gap="lg">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} size="3rem" fw={900} mb="xs">
            {t('app.title')}
          </Title>
          <Text size="lg" c="dimmed" maw={600} mx="auto">
            {t('app.description')}
          </Text>
        </div>

        <Space h="md" />

        <CalculatorForm />

        <Space h="xl" />

        <div style={{ textAlign: 'center', maxWidth: '800px' }}>
          <Title order={3} mb="md">
            {t('calculator.howToUse')}
          </Title>
          <Text c="dimmed" style={{ whiteSpace: 'pre-line' }}>
            {t('calculator.instructions')}
          </Text>
        </div>
      </Stack>
    </Container>
  );
}
