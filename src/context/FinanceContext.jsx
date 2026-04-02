import { createContext, useReducer, useEffect, useMemo } from 'react';
import { initialTransactions } from '../data/transactions';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'zorvyn-finance-data';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

const stored = loadFromStorage();

const initialState = {
  transactions: stored?.transactions || initialTransactions,
  role: stored?.role || 'Viewer',
  darkMode: stored?.darkMode ?? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  searchTerm: '',
  filterType: 'all',
  filterCategory: 'all',
  sortField: 'date',
  sortDirection: 'desc',
  editingTransaction: null,
  isAddModalOpen: false,
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_FILTER_TYPE':
      return { ...state, filterType: action.payload };
    case 'SET_FILTER_CATEGORY':
      return { ...state, filterCategory: action.payload };
    case 'SET_SORT':
      if (state.sortField === action.payload) {
        return { ...state, sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' };
      }
      return { ...state, sortField: action.payload, sortDirection: 'desc' };
    case 'ADD_TRANSACTION': {
      const newId = Math.max(0, ...state.transactions.map(t => t.id)) + 1;
      return {
        ...state,
        transactions: [...state.transactions, { ...action.payload, id: newId }],
        isAddModalOpen: false,
      };
    }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        editingTransaction: null,
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_EDITING':
      return { ...state, editingTransaction: action.payload };
    case 'SET_ADD_MODAL':
      return { ...state, isAddModalOpen: action.payload };
    default:
      return state;
  }
}

function saveToStorage(transactions, role, darkMode) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, role, darkMode }));
  } catch {
    // ignore storage errors
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    saveToStorage(state.transactions, state.role, state.darkMode);
  }, [state.transactions, state.role, state.darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const computed = useMemo(() => {
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const monthlyData = {};
    state.transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expense: 0, balance: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const balanceTrend = sortedMonths.reduce((acc, m) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      acc.push({
        ...monthlyData[m],
        balance: prev + monthlyData[m].income - monthlyData[m].expense,
        label: new Date(m + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      });
      return acc;
    }, []);

    const categoryMap = {};
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const highestCategory = categoryData[0] || { name: 'None', value: 0 };

    const currentMonth = sortedMonths.length > 0 ? monthlyData[sortedMonths[sortedMonths.length - 1]] : null;
    const prevMonth = sortedMonths.length > 1 ? monthlyData[sortedMonths[sortedMonths.length - 2]] : null;
    const monthlyChange = currentMonth && prevMonth
      ? ((currentMonth.expense - prevMonth.expense) / prevMonth.expense * 100).toFixed(1)
      : null;

    const avgMonthlySpend = sortedMonths.length > 0 ? totalExpense / sortedMonths.length : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

    const incomeMap = {};
    state.transactions.filter(t => t.type === 'income').forEach(t => {
      incomeMap[t.category] = (incomeMap[t.category] || 0) + t.amount;
    });
    const topIncomeSource = Object.entries(incomeMap).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    let filtered = state.transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(state.searchTerm.toLowerCase())
        || t.description.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchesType = state.filterType === 'all' || t.type === state.filterType;
      const matchesCategory = state.filterCategory === 'all' || t.category === state.filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });

    filtered = filtered.sort((a, b) => {
      let cmp = 0;
      if (state.sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (state.sortField === 'amount') cmp = a.amount - b.amount;
      else if (state.sortField === 'category') cmp = a.category.localeCompare(b.category);
      return state.sortDirection === 'asc' ? cmp : -cmp;
    });

    const allCategories = [...new Set(state.transactions.map(t => t.category))].sort();

    return {
      totalIncome, totalExpense, balance, balanceTrend, categoryData,
      highestCategory, monthlyChange, avgMonthlySpend, savingsRate,
      topIncomeSource, filteredTransactions: filtered, allCategories,
    };
  }, [state.transactions, state.searchTerm, state.filterType, state.filterCategory, state.sortField, state.sortDirection]);

  const value = useMemo(() => ({ state, dispatch, computed }), [state, computed]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export { FinanceContext };
