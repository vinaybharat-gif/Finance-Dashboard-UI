import { useFinance } from '../hooks/useFinance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../data/transactions';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="card p-3 text-sm" style={{ border: '1px solid var(--color-border)' }}>
      <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{name}</p>
      <p style={{ color: 'var(--color-text-secondary)' }}>{formatCurrency(value)}</p>
    </div>
  );
}

export default function ExpenseBreakdown() {
  const { computed } = useFinance();
  const { categoryData, totalExpense } = computed;

  if (categoryData.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
        <div className="h-64 flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
          No expense data available
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {categoryData.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2.5 mt-4">
        {categoryData.map(cat => {
          const pct = totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(1) : 0;
          return (
            <div key={cat.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#6366f1' }}
                ></span>
                <span style={{ color: 'var(--color-text)' }}>{cat.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--color-text-secondary)' }}>{pct}%</span>
                <span className="font-medium w-20 text-right" style={{ color: 'var(--color-text)' }}>
                  {formatCurrency(cat.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
