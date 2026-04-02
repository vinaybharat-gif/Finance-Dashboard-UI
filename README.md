# Zorvyn Finance Dashboard

A modern, responsive personal finance dashboard built with React, Tailwind CSS v4, and Recharts.

## Features

### Dashboard Overview
- **Summary Cards**: Total Balance, Total Income, Total Expenses, Savings Rate
- **Balance Trend Chart**: Area chart showing income, expense, and cumulative balance over time
- **Expense Breakdown**: Donut chart with category-wise spending distribution
- **Monthly Bar Chart**: Side-by-side comparison of monthly income vs expense
- **Insights Panel**: Smart observations including highest spending category, monthly spending changes, savings rate analysis, and top income source

### Transactions
- Full transaction list with date, category, description, type, and amount
- **Search**: Filter by category or description keywords
- **Filter by Type**: Income, Expense, or All
- **Filter by Category**: Dynamic category dropdown
- **Sorting**: Click column headers to sort by date, amount, or category (asc/desc)
- **Export to CSV**: Download all transactions as a CSV file
- **Empty State**: Graceful handling when no transactions match filters

### Role-Based UI (RBAC Simulation)
- **Viewer Role**: Can only view data and charts
- **Admin Role**: Can add, edit, and delete transactions
- Role switcher available in the header for demonstration

### State Management
- React Context API for global state
- `useReducer` for predictable state updates
- **localStorage persistence**: Transactions, role preference, and dark mode preference survive page refreshes

### UI/UX
- **Dark Mode**: Toggle between light and dark themes (auto-detects system preference)
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Animations**: Smooth slide-up and fade-in animations
- **Empty States**: Informative messages when data is unavailable

## Tech Stack

- **React 19** with functional components and hooks
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vite** for build tooling

## Project Structure

```
src/
├── components/
│   ├── Header.jsx           # App header with role selector and dark mode toggle
│   ├── SummaryCards.jsx     # Financial summary cards
│   ├── BalanceTrend.jsx     # Area chart for balance trend
│   ├── ExpenseBreakdown.jsx # Donut chart for expense categories
│   ├── MonthlyBarChart.jsx  # Bar chart for monthly income vs expense
│   ├── Insights.jsx         # Smart financial insights panel
│   ├── TransactionTable.jsx # Transaction list with filters and sorting
│   └── TransactionModal.jsx # Add/Edit transaction modal
├── context/
│   └── FinanceContext.jsx   # Global state management
├── data/
│   └── transactions.js      # Mock data and constants
├── App.jsx                  # Main application component
├── main.jsx                 # Entry point
└── index.css                # Tailwind CSS and custom styles
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Decisions

1. **Component Architecture**: Each feature is a self-contained component that consumes state from Context, making the codebase modular and testable.

2. **State Management**: Used `useReducer` + Context API instead of Redux to keep dependencies minimal while maintaining predictable state flow.

3. **Styling**: Tailwind CSS v4 with CSS custom properties for theme colors, enabling seamless dark mode switching without class-per-element toggling.

4. **Data Visualization**: Recharts for its declarative API and React-native approach. Three chart types (area, pie, bar) cover time-series, categorical, and comparison views.

5. **RBAC**: Simulated via a dropdown that conditionally renders admin actions (add/edit/delete). The state is persisted so the role selection survives refreshes.

6. **Responsiveness**: CSS Grid with responsive breakpoints ensures the dashboard adapts from mobile to widescreen layouts.
