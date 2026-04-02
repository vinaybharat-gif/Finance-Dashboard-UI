import { useFinance } from '../hooks/useFinance';
import { Search, Plus, ArrowUpDown, Download, Filter } from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SortButton({ field, sortField, onSort }) {
  return (
    <button
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 hover:opacity-80 transition"
      style={{ color: sortField === field ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
    >
      <ArrowUpDown size={14} />
    </button>
  );
}

export default function TransactionTable() {
  const { state, dispatch, computed } = useFinance();
  const { filteredTransactions } = computed;
  const isAdmin = state.role === 'Admin';

  function handleSort(field) {
    dispatch({ type: 'SET_SORT', payload: field });
  }

  function handleExportCSV() {
    const header = 'Date,Category,Description,Type,Amount\n';
    const rows = state.transactions
      .map(t => `${t.date},${t.category},${t.description},${t.type},${t.amount}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zorvyn-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '500ms' }}>
      <div className="p-5 md:p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="text-lg font-semibold">Transactions</h3>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={state.searchTerm}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                className="input-field pl-9 w-full lg:w-48"
              />
            </div>

            <select
              value={state.filterType}
              onChange={(e) => dispatch({ type: 'SET_FILTER_TYPE', payload: e.target.value })}
              className="select-field"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={state.filterCategory}
              onChange={(e) => dispatch({ type: 'SET_FILTER_CATEGORY', payload: e.target.value })}
              className="select-field"
            >
              <option value="all">All Categories</option>
              {computed.allCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button onClick={handleExportCSV} className="btn-secondary">
              <Download size={16} /> Export
            </button>

            {isAdmin && (
              <button
                onClick={() => dispatch({ type: 'SET_ADD_MODAL', payload: true })}
                className="btn-primary"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Date <SortButton field="date" sortField={state.sortField} onSort={handleSort} />
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Category <SortButton field="category" sortField={state.sortField} onSort={handleSort} />
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--color-text-muted)' }}>
                Description
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Type
              </th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--color-text-muted)' }}>
                Amount <SortButton field="amount" sortField={state.sortField} onSort={handleSort} />
              </th>
              {isAdmin && (
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--color-text-muted)' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="p-4 text-sm" style={{ color: 'var(--color-text)' }}>
                    {formatDate(tx.date)}
                  </td>
                  <td className="p-4 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {tx.category}
                  </td>
                  <td className="p-4 text-sm hidden md:table-cell" style={{ color: 'var(--color-text-secondary)' }}>
                    {tx.description}
                  </td>
                  <td className="p-4">
                    <span className={tx.type === 'income' ? 'badge-income' : 'badge-expense'}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`p-4 text-sm font-semibold text-right ${tx.type === 'income' ? 'text-emerald-500' : ''}`}
                    style={tx.type === 'expense' ? { color: 'var(--color-text)' } : {}}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  {isAdmin && (
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => dispatch({ type: 'SET_EDITING', payload: tx })}
                          className="text-xs px-2.5 py-1 rounded-md transition"
                          style={{ color: 'var(--color-accent)', backgroundColor: 'rgba(59,130,246,0.1)' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: tx.id })}
                          className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 transition hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="p-12 text-center">
                  <Filter className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                  <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>No transactions found</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Try adjusting your filters or search term.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
        Showing {filteredTransactions.length} of {state.transactions.length} transactions
      </div>
    </div>
  );
}
