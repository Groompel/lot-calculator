import type {
  CalculationParams,
  CalculationResult,
  TradingSymbol,
} from '../types/trading';

/**
 * Calculate the distance in pips between two prices
 */
export const calculatePipDistance = (
  entryPrice: number,
  stopLoss: number,
  symbol: TradingSymbol
): number => {
  const priceDifference = Math.abs(entryPrice - stopLoss);

  // For XAU/USD, 1 point = 1 pip (not divided by 10 like major forex pairs)
  if (symbol.id === 'XAUUSD') {
    return priceDifference;
  }

  // For major forex pairs, multiply by 10000 to get pips
  return priceDifference * 10000;
};

/**
 * Calculate stop loss price from entry price and pip distance
 */
export const calculateStopLossFromPips = (
  entryPrice: number,
  pipDistance: number,
  symbol: TradingSymbol,
  isBuy: boolean = true
): number => {
  let priceDistance: number;

  // For XAU/USD, 1 pip = 1 point
  if (symbol.id === 'XAUUSD') {
    priceDistance = pipDistance;
  } else {
    // For major forex pairs, divide by 10000 to get price difference
    priceDistance = pipDistance / 10000;
  }

  // For buy orders, stop loss is below entry (subtract)
  // For sell orders, stop loss is above entry (add)
  return isBuy ? entryPrice - priceDistance : entryPrice + priceDistance;
};

/**
 * Calculate the value per pip for the given lot size
 */
export const calculatePipValue = (
  lotSize: number,
  symbol: TradingSymbol
): number => {
  return lotSize * symbol.pipValue;
};

/**
 * Validate calculation parameters
 */
export const validateParams = (params: CalculationParams): string[] => {
  const errors: string[] = [];

  if (params.accountBalance <= 0) {
    errors.push('Account balance must be greater than 0');
  }

  if (params.riskPercentage <= 0 || params.riskPercentage > 100) {
    errors.push('Risk percentage must be between 0 and 100');
  }

  if (params.entryPrice <= 0) {
    errors.push('Entry price must be greater than 0');
  }

  if (params.stopLoss <= 0) {
    errors.push('Stop loss must be greater than 0');
  }

  if (params.entryPrice === params.stopLoss) {
    errors.push('Entry price and stop loss cannot be the same');
  }

  return errors;
};

/**
 * Round lot size to the symbol's lot step
 */
export const roundToLotStep = (
  lotSize: number,
  symbol: TradingSymbol
): number => {
  const steps = Math.round(lotSize / symbol.lotStep);
  return Math.max(steps * symbol.lotStep, symbol.minLotSize);
};

/**
 * Calculate optimal lot size based on risk management parameters
 */
export const calculateLotSize = (
  params: CalculationParams
): CalculationResult => {
  const errors = validateParams(params);

  if (errors.length > 0) {
    return {
      lotSize: 0,
      positionSize: 0,
      riskAmount: 0,
      pipValue: 0,
      pipDistance: 0,
      isValid: false,
      errors,
    };
  }

  const { accountBalance, riskPercentage, entryPrice, stopLoss, symbol } =
    params;

  // Calculate risk amount
  const riskAmount = (accountBalance * riskPercentage) / 100;

  // Calculate pip distance
  const pipDistance = calculatePipDistance(entryPrice, stopLoss, symbol);

  if (pipDistance === 0) {
    return {
      lotSize: 0,
      positionSize: 0,
      riskAmount,
      pipValue: 0,
      pipDistance: 0,
      isValid: false,
      errors: ['Invalid price difference'],
    };
  }

  // Calculate lot size
  // Risk Amount = Lot Size × Pip Value × Pip Distance
  // Therefore: Lot Size = Risk Amount / (Pip Value × Pip Distance)
  const rawLotSize = riskAmount / (symbol.pipValue * pipDistance);

  // Round to lot step and apply min/max limits
  let lotSize = roundToLotStep(rawLotSize, symbol);
  lotSize = Math.min(lotSize, symbol.maxLotSize);
  lotSize = Math.max(lotSize, symbol.minLotSize);

  // Calculate final values
  const pipValue = calculatePipValue(lotSize, symbol);
  const positionSize = lotSize * symbol.contractSize * entryPrice;

  return {
    lotSize: Math.round(lotSize * 100) / 100, // Round to 2 decimal places
    positionSize: Math.round(positionSize * 100) / 100,
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipValue: Math.round(pipValue * 100) / 100,
    pipDistance: Math.round(pipDistance * 100) / 100,
    isValid: true,
    errors: [],
  };
};

/**
 * Format number for display with appropriate decimal places
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format currency for display
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};
