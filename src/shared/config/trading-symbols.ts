import type { TradingSymbol } from '../types/trading';

export const TRADING_SYMBOLS: Record<string, TradingSymbol> = {
  XAUUSD: {
    id: 'XAUUSD',
    name: 'Gold vs US Dollar',
    symbol: 'XAU/USD',
    contractSize: 100, // 100 ounces
    minLotSize: 0.01,
    maxLotSize: 100,
    lotStep: 0.01,
    pipValue: 10, // $10 per pip for 1 lot (corrected from $1)
    marginRequirement: 1, // kept for backwards compatibility but not used
  },
  // Future symbols can be added here
  // EURUSD: {
  //   id: 'EURUSD',
  //   name: 'Euro vs US Dollar',
  //   symbol: 'EUR/USD',
  //   contractSize: 100000,
  //   minLotSize: 0.01,
  //   maxLotSize: 100,
  //   lotStep: 0.01,
  //   pipValue: 10, // $10 per pip for 1 lot
  //   marginRequirement: 2, // kept for backwards compatibility but not used
  // },
  // GBPUSD: {
  //   id: 'GBPUSD',
  //   name: 'British Pound vs US Dollar',
  //   symbol: 'GBP/USD',
  //   contractSize: 100000,
  //   minLotSize: 0.01,
  //   maxLotSize: 100,
  //   lotStep: 0.01,
  //   pipValue: 10, // $10 per pip for 1 lot
  //   marginRequirement: 2, // kept for backwards compatibility but not used
  // },
};

export const DEFAULT_SYMBOL = TRADING_SYMBOLS.XAUUSD;

export const getAvailableSymbols = (): TradingSymbol[] => {
  return Object.values(TRADING_SYMBOLS);
};

export const getSymbolById = (id: string): TradingSymbol | undefined => {
  return TRADING_SYMBOLS[id];
};
