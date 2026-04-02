import { useFinance } from '../hooks/useFinance';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function SummaryCards() {
  const { computed } = useFinance();
  const { balance, totalIncome, totalExpense, savingsRate } = computed;

  const cards = [
    {
      label: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-l-blue-500',
    },
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      borderColor: 'border-l-emerald-500',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpense),
      icon: TrendingDown,
      color: 'red',
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-500',
      borderColor: 'border-l-red-500',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: PiggyBank,
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      borderColor: 'border-l-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`card p-5 md:p-6 border-l-4 ${card.borderColor} animate-slide-up`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {card.label}
              </p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
                {card.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
