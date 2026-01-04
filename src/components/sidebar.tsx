'use client';
import { UserMenu } from '@/components/auth/user-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavLinks from '../config/nav-link';

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-64 max-md:hidden flex flex-col h-screen bg-gradient-to-b from-black via-gray-950 to-black border-r border-white/5"
        >
            {/* Logo Section */}
            <div className="p-5 border-b border-white/5">
                <Link href="/home" className="flex items-center gap-2 group">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                    >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-red-500/20 blur-md -z-10" />
                    </motion.div>
                    <span className="font-bold text-xl tracking-tight">
                        <span className="text-gradient">Cine</span>
                        <span className="text-white">Prix</span>
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-4">Menu</p>
                {NavLinks.map((link, index) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                        >
                            <Link
                                href={link.href}
                                className={cn(
                                    'group flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 relative',
                                    isActive 
                                        ? 'text-white bg-gradient-to-r from-red-600/20 to-red-500/10' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/50"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                
                                <div className={cn(
                                    'p-2 rounded-lg transition-all duration-300',
                                    isActive 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300'
                                )}>
                                    <link.icons className="size-4" />
                                </div>
                                
                                <span className={cn(
                                    'font-medium text-sm transition-colors',
                                    isActive && 'text-white'
                                )}>
                                    {link.name}
                                </span>
                                
                                {/* Hover glow effect */}
                                {isActive && (
                                    <div className="absolute inset-0 rounded-xl bg-red-500/5 blur-xl -z-10" />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>
            
            {/* User Menu at bottom */}
            <div className="p-4 border-t border-white/5 bg-gradient-to-t from-gray-950/80 to-transparent">
                <UserMenu />
            </div>
        </motion.div>
    );
};

export default Sidebar;
