import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCalculator, IconInfoCircle, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  DEFAULT_SYMBOL,
  getAvailableSymbols,
  getSymbolById,
} from '../../shared/config/trading-symbols';
import {
  calculateLotSize,
  formatCurrency,
  formatNumber,
} from '../../shared/lib/lot-calculator';
import type {
  CalculationResult,
  InputMode,
  TradingSymbol,
} from '../../shared/types/trading';

interface FormValues {
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLoss: number;
  pipDistance: number;
  symbolId: string;
}

export function CalculatorForm() {
  const { t } = useTranslation();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedSymbol, setSelectedSymbol] =
    useState<TradingSymbol>(DEFAULT_SYMBOL);
  const [inputMode, setInputMode] = useState<InputMode>('pips'); // Default to pips mode
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      accountBalance: 10000,
      riskPercentage: 2,
      entryPrice: 2650,
      stopLoss: 2630,
      pipDistance: 20,
      symbolId: DEFAULT_SYMBOL.id,
    },
    validate: {
      accountBalance: (value) =>
        value <= 0 ? t('calculator.validation.accountBalancePositive') : null,
      riskPercentage: (value) => {
        if (value <= 0)
          return t('calculator.validation.riskPercentagePositive');
        if (value > 100) return t('calculator.validation.riskPercentageMax');
        return null;
      },
      entryPrice: (value) => {
        if (inputMode === 'price' && value <= 0) {
          return t('calculator.validation.entryPricePositive');
        }
        return null;
      },
      stopLoss: (value) => {
        if (inputMode === 'price' && value <= 0) {
          return t('calculator.validation.stopLossPositive');
        }
        return null;
      },
      pipDistance: (value) => {
        if (inputMode === 'pips' && value <= 0) {
          return t('calculator.validation.pipDistancePositive');
        }
        return null;
      },
    },
  });

  // Debounced form values for auto-calculation
  const currentValues = form.getValues();
  const [debouncedValues] = useDebouncedValue(currentValues, 500);

  const availableSymbols = getAvailableSymbols();

  // Transform symbols for Select component
  const symbolOptions = availableSymbols.map((symbol) => ({
    value: symbol.id,
    label: `${symbol.symbol} - ${symbol.name}`,
  }));

  // Silent validation function for auto-calculation
  const validateFormSilently = (): boolean => {
    const errors = form.validate();
    return Object.keys(errors.errors || {}).length === 0;
  };

  const performCalculation = (
    values: FormValues,
    isAutoCalculation = false
  ) => {
    try {
      const symbol = getSymbolById(values.symbolId);
      if (!symbol) {
        throw new Error('Invalid trading symbol');
      }

      let entryPrice = values.entryPrice;
      let stopLoss = values.stopLoss;

      // If using pips mode, calculate prices from pip distance
      if (inputMode === 'pips') {
        // Use default prices for calculation
        entryPrice = symbol.id === 'XAUUSD' ? 2650 : 1.0545;
        const priceDistance =
          symbol.id === 'XAUUSD'
            ? values.pipDistance
            : values.pipDistance / 10000;
        stopLoss = entryPrice - priceDistance;
      }

      const calculationResult = calculateLotSize({
        accountBalance: values.accountBalance,
        riskPercentage: values.riskPercentage,
        entryPrice,
        stopLoss,
        symbol,
      });

      setResult(calculationResult);

      if (!isAutoCalculation && !calculationResult.isValid) {
        notifications.show({
          title: 'Calculation Warning',
          message: calculationResult.errors.join(', '),
          color: 'yellow',
        });
      }

      // Scroll to results section only on manual calculation on mobile
      if (!isAutoCalculation && resultsSectionRef.current && isMobile) {
        resultsSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    } catch (error) {
      setResult({
        lotSize: 0,
        riskAmount: 0,
        positionSize: 0,
        pipDistance: 0,
        pipValue: 0,
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Calculation failed'],
      });

      if (!isAutoCalculation) {
        notifications.show({
          title: 'Calculation Error',
          message:
            error instanceof Error ? error.message : 'Calculation failed',
          color: 'red',
        });
      }
    }
  };

  const handleSubmit = (values: FormValues) => {
    setHasCalculatedOnce(true);
    performCalculation(values, false);
  };

  // Auto-calculate when form values change (after first manual calculation)
  useEffect(() => {
    if (hasCalculatedOnce && validateFormSilently()) {
      performCalculation(debouncedValues, true);
    }
  }, [debouncedValues, inputMode, hasCalculatedOnce]);

  // Update selected symbol when form value changes
  useEffect(() => {
    const currentSymbolId = form.getValues().symbolId;
    const symbol = getSymbolById(currentSymbolId);
    if (symbol) {
      setSelectedSymbol(symbol);
    }
  }, [form]);

  return (
    <Grid w="100%">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card>
          <Title order={2} mb="md">
            <Group>
              <IconCalculator size={24} />
              {t('calculator.title')}
            </Group>
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Select
                label={t('calculator.form.tradingSymbol')}
                placeholder={t('calculator.form.tradingSymbolPlaceholder')}
                data={symbolOptions}
                key={form.key('symbolId')}
                {...form.getInputProps('symbolId')}
                onChange={(value) => {
                  form.setFieldValue('symbolId', value || DEFAULT_SYMBOL.id);
                  const newSymbol = getSymbolById(value || DEFAULT_SYMBOL.id);
                  if (newSymbol) {
                    setSelectedSymbol(newSymbol);
                  }
                }}
              />

              <NumberInput
                label={t('calculator.form.accountBalance')}
                placeholder={t('calculator.form.accountBalancePlaceholder')}
                min={0}
                decimalScale={2}
                prefix="$"
                thousandSeparator=" "
                decimalSeparator=","
                inputMode="decimal"
                key={form.key('accountBalance')}
                {...form.getInputProps('accountBalance')}
              />

              <NumberInput
                label={t('calculator.form.riskPercentage')}
                placeholder={t('calculator.form.riskPercentagePlaceholder')}
                min={0.1}
                max={100}
                decimalScale={1}
                suffix="%"
                thousandSeparator=" "
                decimalSeparator=","
                inputMode="decimal"
                key={form.key('riskPercentage')}
                {...form.getInputProps('riskPercentage')}
              />

              <div>
                <Text size="sm" fw={500} mb="xs">
                  {t('calculator.form.pipDistanceMode')}
                </Text>
                <SegmentedControl
                  value={inputMode}
                  onChange={(value) => setInputMode(value as InputMode)}
                  data={[
                    {
                      label: t('calculator.form.pipDistanceModes.pips'),
                      value: 'pips',
                    },
                    {
                      label: t('calculator.form.pipDistanceModes.price'),
                      value: 'price',
                    },
                  ]}
                  fullWidth
                />
              </div>

              {inputMode === 'pips' ? (
                <NumberInput
                  label={t('calculator.form.pipDistance')}
                  placeholder={t('calculator.form.pipDistancePlaceholder')}
                  min={0.1}
                  decimalScale={1}
                  suffix=" pips"
                  thousandSeparator=" "
                  decimalSeparator=","
                  inputMode="decimal"
                  key={form.key('pipDistance')}
                  {...form.getInputProps('pipDistance')}
                />
              ) : (
                <Grid>
                  <Grid.Col span={6}>
                    <NumberInput
                      label={t('calculator.form.entryPrice')}
                      placeholder={
                        selectedSymbol.id === 'XAUUSD' ? '$2 650,00' : '1,05450'
                      }
                      min={0}
                      decimalScale={selectedSymbol.id === 'XAUUSD' ? 2 : 5}
                      thousandSeparator=" "
                      decimalSeparator=","
                      prefix={selectedSymbol.id === 'XAUUSD' ? '$' : ''}
                      inputMode="decimal"
                      key={form.key('entryPrice')}
                      {...form.getInputProps('entryPrice')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      label={t('calculator.form.stopLossPrice')}
                      placeholder={
                        selectedSymbol.id === 'XAUUSD' ? '$2 630,00' : '1,05400'
                      }
                      min={0}
                      decimalScale={selectedSymbol.id === 'XAUUSD' ? 2 : 5}
                      thousandSeparator=" "
                      decimalSeparator=","
                      prefix={selectedSymbol.id === 'XAUUSD' ? '$' : ''}
                      inputMode="decimal"
                      key={form.key('stopLoss')}
                      {...form.getInputProps('stopLoss')}
                    />
                  </Grid.Col>
                </Grid>
              )}

              <Button
                type="submit"
                fullWidth
                leftSection={<IconCalculator size={16} />}
              >
                {t('calculator.form.calculateButton')}
              </Button>
            </Stack>
          </form>

          {selectedSymbol && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title={t('calculator.symbolInfo.title')}
              color="blue"
              mt="md"
            >
              <Stack gap="xs">
                <Text size="sm">
                  <strong>{t('calculator.symbolInfo.contractSize')}:</strong>{' '}
                  {formatNumber(selectedSymbol.contractSize, 0)}
                </Text>
                <Text size="sm">
                  <strong>{t('calculator.symbolInfo.pipValue')}:</strong> $
                  {selectedSymbol.pipValue} per lot
                </Text>
                <Text size="sm">
                  <strong>{t('calculator.symbolInfo.lotRange')}:</strong>{' '}
                  {selectedSymbol.minLotSize} - {selectedSymbol.maxLotSize}
                </Text>
              </Stack>
            </Alert>
          )}
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card ref={resultsSectionRef}>
          <Title order={2} mb="md">
            {t('calculator.resultsTitle')}
          </Title>

          {result ? (
            <Stack gap="md">
              {!result.isValid && result.errors.length > 0 && (
                <Alert
                  icon={<IconX size={16} />}
                  title={t('calculator.results.calculationErrors')}
                  color="red"
                >
                  {result.errors.map((error, index) => (
                    <Text key={index} size="sm">
                      {error}
                    </Text>
                  ))}
                </Alert>
              )}

              <Group justify="space-between">
                <Text fw={500}>
                  {t('calculator.results.recommendedLotSize')}:
                </Text>
                <Badge
                  size="xl"
                  variant="filled"
                  color={result.isValid ? 'green' : 'red'}
                >
                  {formatNumber(result.lotSize, 2)}
                </Badge>
              </Group>

              <Divider />

              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    {t('calculator.results.riskAmount')}
                  </Text>
                  <Text fw={500}>{formatCurrency(result.riskAmount)}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    {t('calculator.results.positionSize')}
                  </Text>
                  <Text fw={500}>{formatCurrency(result.positionSize)}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    {t('calculator.results.pipDistance')}
                  </Text>
                  <Text fw={500}>
                    {formatNumber(result.pipDistance, 1)} pips
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    {t('calculator.results.pipValue')}
                  </Text>
                  <Text fw={500}>{formatCurrency(result.pipValue)}</Text>
                </Grid.Col>
              </Grid>
            </Stack>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              {t('calculator.results.emptyState')}
            </Text>
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
}
