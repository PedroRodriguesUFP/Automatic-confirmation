import { Outlet, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: ' Dashboard' },
  { to: '/appointments', label: ' Marcações' },
  { to: '/conversations', label: ' Conversas' },
  { to: '/settings', label: ' Definições' },
]

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-white shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <span className="text-xl font-bold text-blue-600">AutoFlow</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t text-xs text-gray-400">
          AutoFlow v0.1
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
