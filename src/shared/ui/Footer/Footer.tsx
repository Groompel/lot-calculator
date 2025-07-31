import { Box, Container, Text, Group, Anchor } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

export function Footer() {
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
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            © 2025 Empire Gold Trading Solutions. All rights reserved.
          </Text>

          <Group align="center" gap="xs">
            <Text size="sm" c="dimmed">
              Built with
            </Text>
            <IconHeart size={14} color="red" />
            <Text size="sm" c="dimmed">
              using
            </Text>
            <Anchor
              href="https://mantine.dev"
              target="_blank"
              size="sm"
              c="blue"
            >
              Mantine
            </Anchor>
          </Group>
        </Group>

        <Text size="xs" c="dimmed" ta="center" mt="sm">
          ⚠️ Trading involves substantial risk. This calculator is for
          educational purposes only.
        </Text>
      </Container>
    </Box>
  );
}
