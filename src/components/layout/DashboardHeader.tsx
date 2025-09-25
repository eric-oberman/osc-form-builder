import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/utils/cn'

interface DashboardHeaderProps {
  onMenuClick: () => void
  sidebarCollapsed?: boolean
}

export function DashboardHeader({ onMenuClick, sidebarCollapsed = false }: DashboardHeaderProps) {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme, resolvedTheme } = useThemeStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white dark:bg-osc-navy-900 border-b border-osc-navy-200 dark:border-osc-navy-800 shadow-gov-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Mobile menu button and logo */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="lg:hidden p-2 text-osc-navy-600 hover:text-osc-navy-900 hover:bg-osc-navy-100 rounded-md transition-colors duration-200"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Logo and title - hidden on mobile when sidebar is not collapsed */}
          <div className={cn(
            "flex items-center space-x-3 transition-all duration-300",
            !sidebarCollapsed && "hidden lg:flex"
          )}>
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gradient-gov rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OSC</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                Form Builder
              </h1>
              <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
                New York State Comptroller
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <button
            type="button"
            className="p-2 text-osc-navy-600 hover:text-osc-navy-900 hover:bg-osc-navy-100 dark:text-osc-navy-300 dark:hover:text-osc-navy-100 dark:hover:bg-osc-navy-800 rounded-md transition-colors duration-200"
            onClick={toggleTheme}
            title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="sr-only">Toggle theme</span>
            {resolvedTheme === 'light' ? (
              <MoonIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <SunIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* User menu */}
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="flex items-center space-x-2 p-1.5 text-sm bg-white dark:bg-osc-navy-900 rounded-full hover:bg-osc-navy-50 dark:hover:bg-osc-navy-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gov-secondary focus:ring-offset-2 dark:focus:ring-offset-osc-navy-900">
                <span className="sr-only">Open user menu</span>
                {user?.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-osc-navy-600 dark:text-osc-navy-300" />
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400 capitalize">
                    {user?.role.replace('_', ' ')}
                  </p>
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white dark:bg-osc-navy-800 rounded-md shadow-gov-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-osc-navy-200 dark:border-osc-navy-700">
                    <p className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                      {user?.email}
                    </p>
                    <p className="text-xs text-osc-navy-400 dark:text-osc-navy-500 capitalize">
                      {user?.role.replace('_', ' ')} • {user?.department}
                    </p>
                  </div>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/preferences"
                        className={cn(
                          'group flex items-center px-4 py-2 text-sm transition-colors duration-200',
                          active
                            ? 'bg-osc-navy-100 text-osc-navy-900 dark:bg-osc-navy-700 dark:text-osc-navy-100'
                            : 'text-osc-navy-700 dark:text-osc-navy-300'
                        )}
                      >
                        <UserCircleIcon
                          className="mr-3 h-5 w-5 text-osc-navy-400 group-hover:text-osc-navy-500"
                          aria-hidden="true"
                        />
                        User Preferences
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/forms"
                        className={cn(
                          'group flex items-center px-4 py-2 text-sm transition-colors duration-200',
                          active
                            ? 'bg-osc-navy-100 text-osc-navy-900 dark:bg-osc-navy-700 dark:text-osc-navy-100'
                            : 'text-osc-navy-700 dark:text-osc-navy-300'
                        )}
                      >
                        <Cog6ToothIcon
                          className="mr-3 h-5 w-5 text-osc-navy-400 group-hover:text-osc-navy-500"
                          aria-hidden="true"
                        />
                        My Forms
                      </Link>
                    )}
                  </Menu.Item>

                  <div className="border-t border-osc-navy-200 dark:border-osc-navy-700 my-1"></div>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={cn(
                          'group flex w-full items-center px-4 py-2 text-sm text-left transition-colors duration-200',
                          active
                            ? 'bg-osc-navy-100 text-osc-navy-900 dark:bg-osc-navy-700 dark:text-osc-navy-100'
                            : 'text-osc-navy-700 dark:text-osc-navy-300'
                        )}
                      >
                        <ArrowRightOnRectangleIcon
                          className="mr-3 h-5 w-5 text-osc-navy-400 group-hover:text-osc-navy-500"
                          aria-hidden="true"
                        />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
}