import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Title,
  Grid,
  NumberInput,
  Select,
  Button,
  Text,
  Alert,
  Group,
  Stack,
  Divider,
  Badge,
  SegmentedControl,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCalculator,
  IconInfoCircle,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

import {
  calculateLotSize,
  formatCurrency,
  formatNumber,
  calculatePipDistance,
} from '../../shared/lib/lot-calculator';
import {
  getAvailableSymbols,
  DEFAULT_SYMBOL,
  getSymbolById,
} from '../../shared/config/trading-symbols';
import type {
  CalculationResult,
  TradingSymbol,
  InputMode,
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
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedSymbol, setSelectedSymbol] =
    useState<TradingSymbol>(DEFAULT_SYMBOL);
  const [inputMode, setInputMode] = useState<InputMode>('pips'); // Default to pips mode
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

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
        value <= 0 ? 'Account balance must be positive' : null,
      riskPercentage: (value) => {
        if (value <= 0) return 'Risk percentage must be positive';
        if (value > 100) return 'Risk percentage cannot exceed 100%';
        return null;
      },
      entryPrice: (value) => {
        if (inputMode === 'price' && value <= 0) {
          return 'Entry price must be positive';
        }
        return null;
      },
      stopLoss: (value) => {
        if (inputMode === 'price' && value <= 0) {
          return 'Stop loss must be positive';
        }
        return null;
      },
      pipDistance: (value) => {
        if (inputMode === 'pips' && value <= 0) {
          return 'Pip distance must be positive';
        }
        return null;
      },
    },
  });

  // Debounced form values for auto-calculation
  const currentValues = form.getValues();
  const [debouncedValues] = useDebouncedValue(currentValues, 500);

  const availableSymbols = getAvailableSymbols();

  const symbolOptions = availableSymbols.map((symbol) => ({
    value: symbol.id,
    label: `${symbol.symbol} - ${symbol.name}`,
  }));

  // Silent validation function for auto-calculation
  const validateFormSilently = (values: FormValues): boolean => {
    const symbol = getSymbolById(values.symbolId);
    if (!symbol) return false;

    // Check all required fields are positive
    if (values.accountBalance <= 0) return false;
    if (values.riskPercentage <= 0 || values.riskPercentage > 100) return false;

    // Check mode-specific validations
    if (inputMode === 'pips') {
      if (values.pipDistance <= 0) return false;
    } else {
      if (values.entryPrice <= 0) return false;
      if (values.stopLoss <= 0) return false;
      if (values.entryPrice === values.stopLoss) return false;
    }

    return true;
  };

  const performCalculation = (
    values: FormValues,
    isAutomatic: boolean = false
  ) => {
    const symbol = getSymbolById(values.symbolId);
    if (!symbol) {
      if (!isAutomatic) {
        notifications.show({
          title: 'Error',
          message: 'Invalid trading symbol selected',
          color: 'red',
          icon: <IconX size={16} />,
        });
      }
      return;
    }

    let pipDistance = values.pipDistance;

    // If using price mode, calculate pip distance from entry and stop loss
    if (inputMode === 'price') {
      pipDistance = calculatePipDistance(
        values.entryPrice,
        values.stopLoss,
        symbol
      );
    }

    // For calculation, we need a dummy entry price and stop loss based on pip distance
    // We'll use a standard entry price for the symbol and calculate stop loss from it
    const dummyEntryPrice = selectedSymbol.id === 'XAUUSD' ? 2650 : 1.0545;
    let priceDistance: number;

    if (symbol.id === 'XAUUSD') {
      priceDistance = pipDistance;
    } else {
      priceDistance = pipDistance / 10000;
    }

    const dummyStopLoss = dummyEntryPrice - priceDistance;

    const calculationResult = calculateLotSize({
      accountBalance: values.accountBalance,
      riskPercentage: values.riskPercentage,
      entryPrice: dummyEntryPrice,
      stopLoss: dummyStopLoss,
      symbol,
    });

    setResult(calculationResult);

    // Only show notifications for manual calculations
    if (!isAutomatic) {
      if (calculationResult.isValid) {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        notifications.show({
          title: 'Calculation Error',
          message:
            calculationResult.errors[0] || 'Invalid calculation parameters',
          color: 'red',
          icon: <IconX size={16} />,
        });
      }
    }
  };

  const handleSubmit = (values: FormValues) => {
    performCalculation(values, false);
    setHasCalculatedOnce(true);
  };

  // Auto-calculation effect when values change (after first manual calculation)
  useEffect(() => {
    if (hasCalculatedOnce && validateFormSilently(debouncedValues)) {
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
              Lot Size Calculator
            </Group>
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Select
                label="Trading Symbol"
                placeholder="Select a trading symbol"
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
                label="Account Balance"
                placeholder="Enter your account balance"
                min={0}
                decimalScale={2}
                prefix="$"
                thousandSeparator=","
                key={form.key('accountBalance')}
                {...form.getInputProps('accountBalance')}
              />

              <NumberInput
                label="Risk Percentage"
                placeholder="Risk per trade"
                min={0.1}
                max={100}
                decimalScale={1}
                suffix="%"
                key={form.key('riskPercentage')}
                {...form.getInputProps('riskPercentage')}
              />

              <div>
                <Text size="sm" fw={500} mb="xs">
                  How to set pip distance?
                </Text>
                <SegmentedControl
                  value={inputMode}
                  onChange={(value) => setInputMode(value as InputMode)}
                  data={[
                    { label: 'Direct Pips', value: 'pips' },
                    { label: 'From Prices', value: 'price' },
                  ]}
                  fullWidth
                />
              </div>

              {inputMode === 'pips' ? (
                <NumberInput
                  label="Pip Distance"
                  placeholder="20"
                  min={0.1}
                  decimalScale={1}
                  suffix=" pips"
                  key={form.key('pipDistance')}
                  {...form.getInputProps('pipDistance')}
                />
              ) : (
                <Grid>
                  <Grid.Col span={6}>
                    <NumberInput
                      label="Entry Price"
                      placeholder={
                        selectedSymbol.id === 'XAUUSD' ? '$2,650.00' : '1.05450'
                      }
                      min={0}
                      decimalScale={selectedSymbol.id === 'XAUUSD' ? 2 : 5}
                      thousandSeparator=","
                      prefix={selectedSymbol.id === 'XAUUSD' ? '$' : ''}
                      key={form.key('entryPrice')}
                      {...form.getInputProps('entryPrice')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      label="Stop Loss Price"
                      placeholder={
                        selectedSymbol.id === 'XAUUSD' ? '$2,630.00' : '1.05400'
                      }
                      min={0}
                      decimalScale={selectedSymbol.id === 'XAUUSD' ? 2 : 5}
                      thousandSeparator=","
                      prefix={selectedSymbol.id === 'XAUUSD' ? '$' : ''}
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
                Calculate Lot Size
              </Button>
            </Stack>
          </form>

          {selectedSymbol && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Symbol Information"
              color="blue"
              mt="md"
            >
              <Stack gap="xs">
                <Text size="sm">
                  <strong>Contract Size:</strong>{' '}
                  {formatNumber(selectedSymbol.contractSize, 0)}
                </Text>
                <Text size="sm">
                  <strong>Pip Value:</strong> ${selectedSymbol.pipValue} per lot
                </Text>
                <Text size="sm">
                  <strong>Lot Range:</strong> {selectedSymbol.minLotSize} -{' '}
                  {selectedSymbol.maxLotSize}
                </Text>
              </Stack>
            </Alert>
          )}
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card ref={resultsSectionRef}>
          <Title order={2} mb="md">
            Calculation Results
          </Title>

          {result ? (
            <Stack gap="md">
              {!result.isValid && result.errors.length > 0 && (
                <Alert
                  icon={<IconX size={16} />}
                  title="Calculation Errors"
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
                <Text fw={500}>Recommended Lot Size:</Text>
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
                    Risk Amount
                  </Text>
                  <Text fw={500}>{formatCurrency(result.riskAmount)}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Position Size
                  </Text>
                  <Text fw={500}>{formatCurrency(result.positionSize)}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Pip Distance
                  </Text>
                  <Text fw={500}>
                    {formatNumber(result.pipDistance, 1)} pips
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Pip Value
                  </Text>
                  <Text fw={500}>{formatCurrency(result.pipValue)}</Text>
                </Grid.Col>
              </Grid>
            </Stack>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              Enter your trading parameters and click "Calculate Lot Size" to
              see results
            </Text>
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
}
