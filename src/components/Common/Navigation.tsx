import { Building2, FileText, Settings, LogOut, User, Home, Database } from 'lucide-react';
import { useFormBuilderStore } from '../../stores/useFormBuilderStore';

type PageType = 'home' | 'forms' | 'responses' | 'settings';

const Navigation = () => {
  const { currentPage, setCurrentPage, currentUser, logout } = useFormBuilderStore();

  const navItems: Array<{ id: PageType; label: string; icon: React.ComponentType<any> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'responses', label: 'Responses', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-soft">
      <div className="container-max">
        <div className="flex items-center justify-between h-18">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-osc-navy to-osc-navy-light rounded-xl flex items-center justify-center shadow-soft-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-osc-navy">OSC Form Builder</h1>
                <p className="text-sm text-slate-600 -mt-1 font-medium">New York State Office of the State Comptroller</p>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`nav-link flex items-center space-x-2 ${
                      currentPage === item.id ? 'active' : ''
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3 px-4 py-2.5 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 bg-gradient-to-br from-osc-blue to-osc-blue-light rounded-full flex items-center justify-center shadow-soft">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-osc-navy">{currentUser?.name}</div>
                <div className="text-xs text-slate-500 capitalize font-medium">{currentUser?.role}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="btn-secondary flex items-center space-x-2 !px-3 !py-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex space-x-1 py-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-link flex-1 flex items-center justify-center space-x-1 ${
                    currentPage === item.id ? 'active' : ''
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;