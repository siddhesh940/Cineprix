'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NetflixNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/search', label: 'Search' },
    { href: '/favorites', label: 'My List' },
    { href: '/recommendations', label: 'For You' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-black/95 backdrop-blur-md border-b border-gray-800/50" 
          : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-red-600 font-bold text-2xl lg:text-3xl"
            >
              CINEPRIX
            </motion.div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm lg:text-base font-medium transition-colors duration-200",
                  pathname === link.href 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Link href="/search">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 transition-colors"
              >
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 transition-colors p-2 flex items-center space-x-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown 
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    showUserMenu && "rotate-180"
                  )} 
                />
              </Button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-md border border-gray-800 rounded-lg py-2 shadow-xl"
                  >
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-white text-sm font-medium">Demo User</p>
                      <p className="text-gray-400 text-xs">demo@cineprix.com</p>
                    </div>
                    
                    <Link href="/favorites" className="block">
                      <div className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm">
                        My List
                      </div>
                    </Link>
                    
                    <Link href="/recommendations" className="block">
                      <div className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm">
                        Account
                      </div>
                    </Link>
                    
                    <div className="border-t border-gray-800 mt-2 pt-2">
                      <div className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm cursor-pointer">
                        Sign Out
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 z-40">
        <div className="flex items-center justify-around py-2">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 text-xs",
                pathname === link.href 
                  ? "text-red-600" 
                  : "text-gray-400"
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {/* Simple icon representation */}
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  pathname === link.href ? "bg-red-600" : "bg-gray-400"
                )} />
              </div>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}