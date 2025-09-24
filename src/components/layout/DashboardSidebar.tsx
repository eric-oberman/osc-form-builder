import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  DocumentPlusIcon,
  FolderIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserIcon,
  XMarkIcon,
  ChevronLeftIcon,
  SparklesIcon,
  PresentationChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  DocumentPlusIcon as DocumentPlusIconSolid,
  FolderIcon as FolderIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UsersIcon as UsersIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  UserIcon as UserIconSolid,
  SparklesIcon as SparklesIconSolid,
  PresentationChartBarIcon as PresentationChartBarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid
} from '@heroicons/react/24/solid'

import { useAuthStore, canAccessAdmin } from '@/stores/authStore'
import { cn } from '@/utils/cn'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  activeIcon: React.ComponentType<any>
  current?: boolean
  adminOnly?: boolean
  badge?: number
}

interface DashboardSidebarProps {
  collapsed?: boolean
  mobile?: boolean
  onClose?: () => void
  onToggleCollapsed?: () => void
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    activeIcon: HomeIconSolid
  },
  {
    name: 'Form Builder',
    href: '/forms/new',
    icon: DocumentPlusIcon,
    activeIcon: DocumentPlusIconSolid
  },
  {
    name: 'Forms',
    href: '/forms',
    icon: FolderIcon,
    activeIcon: FolderIconSolid
  },
  {
    name: 'Form Responses',
    href: '/analytics',
    icon: DocumentTextIcon,
    activeIcon: DocumentTextIconSolid
  },
  {
    name: 'User Preferences',
    href: '/preferences',
    icon: UserIcon,
    activeIcon: UserIconSolid
  },
  {
    name: 'AI Assistant',
    href: '/ai-assistant',
    icon: SparklesIcon,
    activeIcon: SparklesIconSolid,
    badge: 2
  },
  {
    name: 'Tutorial',
    href: '/tutorial',
    icon: PresentationChartBarIcon,
    activeIcon: PresentationChartBarIconSolid
  },
  {
    name: 'Admin Console',
    href: '/admin',
    icon: Cog6ToothIcon,
    activeIcon: Cog6ToothIconSolid,
    adminOnly: true
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: UsersIcon,
    activeIcon: UsersIconSolid,
    adminOnly: true
  }
]

export function DashboardSidebar({
  collapsed = false,
  mobile = false,
  onClose,
  onToggleCollapsed
}: DashboardSidebarProps) {
  const { user } = useAuthStore()

  const filteredNavigation = navigation.filter(item =>
    !item.adminOnly || canAccessAdmin(user)
  )

  return (
    <div
      className={cn(
        'flex flex-col bg-white dark:bg-osc-navy-900 border-r border-osc-navy-200 dark:border-osc-navy-800 shadow-gov h-full',
        mobile && 'fixed inset-y-0 left-0 z-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-osc-navy-200 dark:border-osc-navy-800">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-gov rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OSC</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                Form Builder
              </h1>
              <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
                New York State
              </p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="h-8 w-8 bg-gradient-gov rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">OSC</span>
          </div>
        )}

        {mobile && (
          <button
            type="button"
            className="p-1.5 text-osc-navy-600 hover:text-osc-navy-900 hover:bg-osc-navy-100 rounded-md transition-colors duration-200"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}

        {!mobile && onToggleCollapsed && (
          <button
            type="button"
            className="p-1.5 text-osc-navy-600 hover:text-osc-navy-900 hover:bg-osc-navy-100 rounded-md transition-colors duration-200"
            onClick={onToggleCollapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="sr-only">
              {collapsed ? 'Expand' : 'Collapse'} sidebar
            </span>
            <ChevronLeftIcon
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                collapsed && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-md text-sm font-medium transition-all duration-200',
                collapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2',
                isActive
                  ? 'bg-gov-secondary text-white shadow-gov'
                  : 'text-osc-navy-700 hover:text-osc-navy-900 hover:bg-osc-navy-100 dark:text-osc-navy-300 dark:hover:text-osc-navy-100 dark:hover:bg-osc-navy-800'
              )
            }
          >
            {({ isActive }) => {
              const IconComponent = isActive ? item.activeIcon : item.icon
              return (
                <>
                  <IconComponent
                    className={cn(
                      'flex-shrink-0 h-5 w-5',
                      !collapsed && 'mr-3',
                      isActive ? 'text-white' : 'text-osc-navy-500 group-hover:text-osc-navy-700'
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && (
                    <span className="flex-1">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        'ml-auto inline-block py-0.5 px-2 text-xs rounded-full font-medium',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gov-secondary text-white'
                      )}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-osc-navy-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      {item.badge && (
                        <span className="ml-2 bg-gov-secondary px-1.5 py-0.5 text-xs rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )
            }}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-osc-navy-200 dark:border-osc-navy-800 p-4">
        {!collapsed ? (
          <div className="text-center">
            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
              OSC Form Builder v1.0.0
            </p>
            <p className="text-xs text-osc-navy-400 dark:text-osc-navy-500 mt-1">
              © 2024 New York State
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="h-2 w-2 bg-osc-navy-300 rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  )
}