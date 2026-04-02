import { useFinance } from '../hooks/useFinance';
import { AlertTriangle, TrendingUp, ArrowDown, ArrowUp, Lightbulb, DollarSign } from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function Insights() {
  const { computed } = useFinance();
  const { highestCategory, monthlyChange, avgMonthlySpend, savingsRate, topIncomeSource } = computed;

  const insights = [];

  if (highestCategory.name !== 'None') {
    insights.push({
      icon: AlertTriangle,
      color: 'amber',
      title: 'Highest Spending',
      text: `${highestCategory.name} is your biggest expense at ${formatCurrency(highestCategory.value)}.`,
    });
  }

  if (monthlyChange !== null) {
    const isUp = parseFloat(monthlyChange) > 0;
    insights.push({
      icon: isUp ? ArrowUp : ArrowDown,
      color: isUp ? 'red' : 'green',
      title: 'Monthly Change',
      text: `Your spending ${isUp ? 'increased' : 'decreased'} by ${Math.abs(monthlyChange)}% compared to last month.`,
    });
  }

  if (avgMonthlySpend > 0) {
    insights.push({
      icon: DollarSign,
      color: 'blue',
      title: 'Avg Monthly Spend',
      text: `You spend an average of ${formatCurrency(avgMonthlySpend)} per month.`,
    });
  }

  if (parseFloat(savingsRate) > 0) {
    const sr = parseFloat(savingsRate);
    insights.push({
      icon: TrendingUp,
      color: sr >= 20 ? 'green' : sr >= 10 ? 'amber' : 'red',
      title: 'Savings Rate',
      text: sr >= 20
        ? `Excellent! You're saving ${savingsRate}% of your income.`
        : sr >= 10
          ? `You're saving ${savingsRate}% — aim for 20% for financial health.`
          : `Your savings rate is ${savingsRate}%. Consider reducing expenses.`,
    });
  }

  if (topIncomeSource[0] !== 'None') {
    insights.push({
      icon: Lightbulb,
      color: 'purple',
      title: 'Top Income Source',
      text: `${topIncomeSource[0]} brings in ${formatCurrency(topIncomeSource[1])}, your primary income source.`,
    });
  }

  if (insights.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Insights</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Add more transactions to see insights.</p>
      </div>
    );
  }

  const colorMap = {
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
  };

  return (
    <div className="card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-lg font-semibold mb-4">Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const colors = colorMap[insight.color] || colorMap.blue;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${colors.border}`}
              style={{ backgroundColor: 'var(--color-bg)' }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0`}>
                  <insight.icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                    {insight.title}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {insight.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
