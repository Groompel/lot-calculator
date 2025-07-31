import { useState } from 'react';
import { Menu, ActionIcon, Group, Text, Button } from '@mantine/core';
import { IconLanguage, IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setOpened(false);
  };

  return (
    <Menu opened={opened} onChange={setOpened} position="bottom-end" withArrow>
      <Menu.Target>
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          px="xxs"
          aria-label={t('language.select')}
        >
          <Group gap={4} wrap="nowrap">
            <Text>{currentLanguage.flag}</Text>
            <IconChevronDown size={12} />
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('language.select')}</Menu.Label>
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            leftSection={<Text>{language.flag}</Text>}
            color={currentLanguage.code === language.code ? 'blue' : undefined}
          >
            {language.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
