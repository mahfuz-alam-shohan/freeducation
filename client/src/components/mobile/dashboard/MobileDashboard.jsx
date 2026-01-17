import React from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { GraduationCap, Users, Settings, LogOut, Plus, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

export const MobileDashboard = () => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const menuItems = [
    { icon: Users, label: 'User Management', color: 'text-blue-600' },
    { icon: GraduationCap, label: 'Content Management', color: 'text-green-600' },
    { icon: Settings, label: 'Settings', color: 'text-gray-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">freeducation</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.data?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.data?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.data?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.data?.name}</p>
              <p className="text-sm text-gray-500">{user?.data?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Welcome Card */}
        <div className="mobile-card mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Welcome back!</h2>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Manage your freeducation platform from here. You can add new admins, manage users, and configure system settings.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-xs text-blue-700">Total Admins</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-xs text-green-700">Total Users</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mobile-card">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Plus className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-900">Add New Admin</span>
              </div>
              <span className="text-primary-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Manage Users</span>
              </div>
              <span className="text-gray-600">→</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mobile-card mt-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">System initialized</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Admin account created</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
