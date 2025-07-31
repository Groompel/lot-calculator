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
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '../../../features/theme-switcher/ThemeSwitcher';
import { LanguageSwitcher } from '../../../features/language-switcher/LanguageSwitcher';

// Import logo image (you may need to add this to your assets)
const logoImage = '/logo.png'; // Placeholder path

export function Header() {
  const { t } = useTranslation();

  const socialLinks = [
    {
      icon: IconBrandTwitter,
      href: '#',
      label: t('header.socialLinks.twitter'),
    },
    {
      icon: IconBrandLinkedin,
      href: '#',
      label: t('header.socialLinks.linkedin'),
    },
    {
      icon: IconBrandFacebook,
      href: '#',
      label: t('header.socialLinks.facebook'),
    },
    {
      icon: IconBrandInstagram,
      href: '#',
      label: t('header.socialLinks.instagram'),
    },
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
              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGQzEwNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkVHPC90ZXh0Pgo8L3N2Zz4K"
            />
            <div>
              <Text fw={700} size="lg">
                {t('header.companyName')}
              </Text>
            </div>
          </Group>

          {/* Navigation and Actions */}
          <Group align="center" gap="xs">
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

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
