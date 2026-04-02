import { useFinance } from '../hooks/useFinance';
import { LayoutDashboard, Moon, Sun, Shield, Eye } from 'lucide-react';

export default function Header() {
  const { state, dispatch } = useFinance();

  return (
    <header className="card p-4 md:p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Zorvyn Finance
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Personal Finance Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium hidden sm:block" style={{ color: 'var(--color-text-secondary)' }}>
            Role:
          </label>
          <select
            value={state.role}
            onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
            className="select-field text-sm"
          >
            <option value="Viewer">Viewer</option>
            <option value="Admin">Admin</option>
          </select>
          <span className={`p-1.5 rounded-lg ${state.role === 'Admin' ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
            {state.role === 'Admin'
              ? <Shield className="w-4 h-4 text-purple-500" />
              : <Eye className="w-4 h-4 text-blue-500" />
            }
          </span>
        </div>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className="p-2.5 rounded-lg transition"
          style={{ backgroundColor: 'var(--color-bg-hover)' }}
          title={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {state.darkMode
            ? <Sun className="w-4 h-4 text-amber-500" />
            : <Moon className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
          }
        </button>
      </div>
    </header>
  );
}
