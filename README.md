# Trading Lot Size Calculator

A modern, professional trading lot size calculator built with React, TypeScript, and Mantine UI. Calculate optimal position sizes based on risk management principles for various trading instruments, starting with XAU/USD (Gold).

![Trading Calculator](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Mantine](https://img.shields.io/badge/Mantine-8+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7+-purple.svg)

## Features

- 🎯 **Precise Lot Size Calculation** - Calculate optimal lot sizes based on account balance and risk percentage
- 📊 **Multiple Trading Symbols** - Support for XAU/USD, EUR/USD, GBP/USD (easily configurable for more)
- 🎨 **Modern UI/UX** - Clean, minimal design with Mantine components
- 🌓 **Dark/Light Theme** - Automatic theme switching with manual override
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Calculations** - Instant feedback with form validation
- 🧮 **Advanced Risk Management** - Margin requirements, pip calculations, and position sizing
- 🏗️ **FSD Architecture** - Feature-Sliced Design for maintainable, scalable code

## Trading Features

### Supported Calculations

- **Lot Size** - Optimal position size based on risk parameters
- **Position Value** - Total position size in USD
- **Risk Amount** - Total amount at risk per trade
- **Pip Value** - Value per pip movement
- **Pip Distance** - Distance between entry and stop loss
- **Margin Required** - Required margin for the position

### Supported Instruments

- **XAU/USD (Gold)** - 100 oz contracts, $1 per pip
- **EUR/USD** - Standard forex pair, $10 per pip per lot
- **GBP/USD** - Standard forex pair, $10 per pip per lot
- _More instruments can be easily added_

## Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Mantine 8.x** - Modern React components library
- **PostCSS** - CSS processing with Mantine preset
- **Tabler Icons** - Beautiful SVG icons
- **Feature-Sliced Design** - Scalable architecture pattern

## Project Structure

```
src/
├── app/                    # App layer - global configs, providers
│   ├── providers/         # React providers (Mantine, etc.)
│   └── styles/           # Global styles and theme
├── pages/                 # Pages layer - page components
│   └── calculator/       # Calculator page
├── widgets/              # Widgets layer - complex UI blocks
│   └── calculator-form/  # Main calculator form widget
├── features/             # Features layer - business features
│   ├── lot-calculation/  # Lot size calculation logic
│   └── theme-switcher/   # Dark/light theme toggle
├── entities/             # Entities layer - business entities
│   └── trading-position/ # Trading position models
└── shared/               # Shared layer - reusable code
    ├── ui/              # Shared UI components
    ├── lib/             # Utility functions
    ├── config/          # Configuration files
    ├── types/           # TypeScript types
    └── assets/          # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd trading-calculator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
```

## Usage

1. **Select Trading Symbol** - Choose from the dropdown (XAU/USD recommended)
2. **Enter Account Balance** - Your total trading account size
3. **Set Risk Percentage** - Recommended 1-2% per trade
4. **Input Entry Price** - Your planned entry point
5. **Set Stop Loss** - Your stop loss level
6. **Calculate** - Get instant results

### Example Calculation

```
Account Balance: $10,000
Risk Percentage: 2%
Entry Price: $2,650 (XAU/USD)
Stop Loss: $2,630

Results:
- Recommended Lot Size: 1.00
- Risk Amount: $200
- Position Size: $265,000
- Pip Distance: 20 pips
- Margin Required: $2,650
```

## Risk Management Features

- **Account Balance Validation** - Ensures sufficient funds
- **Margin Requirement Checking** - Validates available margin
- **Lot Size Limits** - Respects min/max lot sizes per instrument
- **Risk Percentage Controls** - Prevents over-leveraging
- **Real-time Validation** - Instant feedback on inputs

## Customization

### Adding New Trading Symbols

Edit `src/shared/config/trading-symbols.ts`:

```typescript
export const TRADING_SYMBOLS = {
  // ... existing symbols
  USDJPY: {
    id: 'USDJPY',
    name: 'US Dollar vs Japanese Yen',
    symbol: 'USD/JPY',
    contractSize: 100000,
    minLotSize: 0.01,
    maxLotSize: 100,
    lotStep: 0.01,
    pipValue: 10,
    marginRequirement: 2,
  },
};
```

### Theming

Customize the theme in `src/app/styles/theme.ts`:

```typescript
export const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    // Add custom colors
  },
  // ... other theme settings
});
```

## Architecture Principles

This project follows **Feature-Sliced Design (FSD)** methodology:

- **🎯 Isolation** - Each layer is independent
- **📋 Standardization** - Consistent structure across features
- **🔄 Reusability** - Shared code in dedicated layer
- **🧪 Testability** - Easy to test individual components
- **📈 Scalability** - Easy to add new features and symbols

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-symbol`)
3. Commit changes (`git commit -am 'Add new trading symbol'`)
4. Push to branch (`git push origin feature/new-symbol`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

⚠️ **Trading Risk Warning**: This calculator is for educational and informational purposes only. Trading financial instruments involves substantial risk and may not be suitable for all investors. Past performance is not indicative of future results. Always consult with a qualified financial advisor before making trading decisions.

---

Built with ❤️ by Empire Gold Trading Solutions
