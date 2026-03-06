'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plus, Package, Home, History, UserCircle, CheckCircle } from 'lucide-react'
import { UserRole } from '@/lib/mockData'


interface SidebarProps {
  role: UserRole
}

const menuItems = {
  donor: [
    { href: '/donor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/donor/new', label: 'Post Donation', icon: Plus },
  ],
  ngo: [
    { href: '/ngo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ngo/receiving', label: 'Receiving', icon: Package },
    { href: '/ngo/history', label: 'History', icon: History },
    { href: '/ngo/profile', label: 'Profile', icon: UserCircle },
  ],
  volunteer: [
    { href: '/volunteer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/volunteer/pickups', label: 'Live Pickups', icon: Package },
    { href: '/volunteer/completed', label: 'Completed Deliveries', icon: CheckCircle },
    { href: '/volunteer/profile', label: 'Profile', icon: UserCircle },
  ],
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const items = menuItems[role]

  return (
    <aside className="w-64 bg-white border-r border-gray-300 min-h-screen p-4">
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Home</span>
        </Link>
      </nav>
    </aside>
  )
}
