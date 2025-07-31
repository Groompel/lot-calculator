import { Box, Container, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      py="md"
      style={(theme) => ({
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        marginTop: 'auto',
      })}
    >
      <Container size="lg">
        <Text size="sm" c="dimmed" ta="center">
          {t('footer.copyright')}
        </Text>

        <Text size="xs" c="dimmed" ta="center" mt="sm">
          {t('footer.disclaimer')}
        </Text>
      </Container>
    </Box>
  );
}
