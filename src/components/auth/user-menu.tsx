'use client'

import { useAuth } from '@/context/demo-auth-context'
import { Heart, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Simple toast/alert for feedback (replace with your own toast if available)
function showToast(message: string, type: 'success' | 'error' = 'success') {
  console.log(`${type === 'error' ? 'Error: ' : 'Success: '}${message}`)
  // You can replace this with a proper toast notification library
  if (typeof window !== 'undefined' && type === 'error') {
    window.alert(`Error: ${message}`)
  }
}

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) return null

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 w-full"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-white text-sm font-medium flex-1 text-left">
          {displayName}
        </span>
        <div className="flex flex-col gap-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-gray-700">
            <p className="text-white font-medium truncate">{displayName}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
          
          <div className="py-2">
            <Link
              href="/favorites"
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="w-4 h-4" />
              <span>My Favorites</span>
            </Link>
            
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </Link>
          </div>
          
          <div className="py-2 border-t border-gray-700">
            <button
              onClick={async () => {
                console.log('Sign out button clicked');
                setIsOpen(false); // Close dropdown immediately
                try {
                  console.log('Attempting to sign out...');
                  await signOut();
                  console.log('Sign out successful');
                  showToast('Signed out successfully', 'success');
                } catch (error) {
                  console.error('Sign out error:', error);
                  showToast('Failed to sign out. Please try again.', 'error');
                }
              }}
              className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors w-full text-left font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}