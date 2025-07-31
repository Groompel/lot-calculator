export interface TradingSymbol {
  id: string;
  name: string;
  symbol: string;
  contractSize: number;
  minLotSize: number;
  maxLotSize: number;
  lotStep: number;
  pipValue: number;
  marginRequirement: number; // as percentage
}

export interface CalculationParams {
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLoss: number;
  symbol: TradingSymbol;
}

export interface CalculationResult {
  lotSize: number;
  positionSize: number;
  riskAmount: number;
  pipValue: number;
  pipDistance: number;
  isValid: boolean;
  errors: string[];
}

export type InputMode = 'price' | 'pips';

export interface TradingPosition {
  symbol: TradingSymbol;
  lotSize: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
}
