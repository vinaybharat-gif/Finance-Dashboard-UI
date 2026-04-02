import { FinanceProvider } from './context/FinanceContext';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import BalanceTrend from './components/BalanceTrend';
import ExpenseBreakdown from './components/ExpenseBreakdown';
import MonthlyBarChart from './components/MonthlyBarChart';
import Insights from './components/Insights';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';

function Dashboard() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <Header />

      <section className="mb-8">
        <SummaryCards />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <BalanceTrend />
        <ExpenseBreakdown />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <MonthlyBarChart />
        <div className="lg:col-span-2">
          <Insights />
        </div>
      </section>

      <section className="mb-8">
        <TransactionTable />
      </section>

      <TransactionModal />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}
