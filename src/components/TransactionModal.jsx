import { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { CATEGORIES } from '../data/transactions';
import { X } from 'lucide-react';

function getInitialForm(tx) {
  if (tx) {
    return {
      date: tx.date,
      amount: tx.amount.toString(),
      category: tx.category,
      type: tx.type,
      description: tx.description,
    };
  }
  return {
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Groceries',
    type: 'expense',
    description: '',
  };
}

export default function TransactionModal() {
  const { state, dispatch } = useFinance();
  const isEditing = !!state.editingTransaction;
  const isOpen = state.isAddModalOpen || isEditing;
  const tx = state.editingTransaction;

  const [form, setForm] = useState(() => getInitialForm(tx));

  // Derive form sync key from modal state
  const modalId = tx?.id ?? (state.isAddModalOpen ? 'new' : null);
  const [prevModalId, setPrevModalId] = useState(null);

  if (modalId !== null && modalId !== prevModalId) {
    setPrevModalId(modalId);
    const newForm = getInitialForm(tx);
    // Only update if form is different
    setForm(prev => {
      if (prev.date === newForm.date && prev.amount === newForm.amount && prev.category === newForm.category && prev.type === newForm.type && prev.description === newForm.description) {
        return prev;
      }
      return newForm;
    });
  }

  if (!isOpen) {
    if (prevModalId !== null) setPrevModalId(null);
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;

    const data = {
      date: form.date,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      description: form.description,
    };

    if (isEditing) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...data, id: tx.id } });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: data });
    }
  }

  function handleClose() {
    dispatch({ type: 'SET_EDITING', payload: null });
    dispatch({ type: 'SET_ADD_MODAL', payload: false });
  }

  const availableCategories = form.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="relative card w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg transition hover:bg-black/5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value, category: '' })}
                className="select-field w-full"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="select-field w-full"
              required
            >
              <option value="" disabled>Select category</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Amount ($)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="input-field w-full"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field w-full"
              placeholder="Transaction description"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {isEditing ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
