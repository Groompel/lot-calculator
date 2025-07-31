import {
  MantineProvider as BaseMantineProvider,
  ColorSchemeScript,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../styles/theme';
import type { ReactNode } from 'react';

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="auto">
      <ColorSchemeScript defaultColorScheme="auto" />
      <Notifications />
      {children}
    </BaseMantineProvider>
  );
}
