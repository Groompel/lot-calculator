import {
  Group,
  Box,
  Text,
  ActionIcon,
  Image,
  Anchor,
  Container,
} from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
} from '@tabler/icons-react';
import { ThemeSwitcher } from '../../../features/theme-switcher/ThemeSwitcher';
import logoImage from '../../assets/logo.jpg';

export function Header() {
  const socialLinks = [
    { icon: IconBrandTwitter, href: '#', label: 'Twitter' },
    { icon: IconBrandLinkedin, href: '#', label: 'LinkedIn' },
    { icon: IconBrandFacebook, href: '#', label: 'Facebook' },
    { icon: IconBrandInstagram, href: '#', label: 'Instagram' },
  ];

  return (
    <Box
      component="header"
      h={70}
      style={(theme) => ({
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--mantine-color-body)',
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
      })}
    >
      <Container size="lg" h="100%">
        <Group justify="space-between" align="center" h="100%">
          {/* Logo and Company Name */}
          <Group align="center">
            <Image
              src={logoImage}
              alt="Empire Gold"
              h={40}
              w={40}
              radius="md"
              style={{ objectFit: 'cover' }}
            />
            <div>
              <Text fw={700} size="lg">
                Empire Gold
              </Text>
              <Text size="xs" c="dimmed">
                Trading Solutions
              </Text>
            </div>
          </Group>

          {/* Navigation and Actions */}
          <Group align="center" gap="md">
            {/* Social Links */}
            <Group gap="xs" visibleFrom="sm">
              {socialLinks.map((social) => (
                <Anchor key={social.label} href={social.href} target="_blank">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="sm"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </ActionIcon>
                </Anchor>
              ))}
            </Group>

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
