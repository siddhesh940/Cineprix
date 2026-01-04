"use client";

import NavLinks from '@/config/nav-link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50">
            <div className="flex justify-around items-center py-2 px-1 max-w-lg mx-auto">
                {NavLinks.map(link => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            href={link.href}
                            key={link.name}
                            className="relative flex flex-col items-center py-1.5 px-3 min-w-[64px]"
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    'p-2 rounded-xl transition-all duration-300',
                                    isActive 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : 'text-gray-500'
                                )}
                            >
                                <link.icons className="size-5" />
                            </motion.div>
                            
                            <span className={cn(
                                'text-[10px] mt-1 font-medium transition-colors',
                                isActive ? 'text-red-400' : 'text-gray-500'
                            )}>
                                {link.name}
                            </span>
                            
                            {/* Active indicator dot */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottomnav-active"
                                    className="absolute -top-0.5 w-1 h-1 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
            
            {/* Safe area padding for iOS */}
            <div className="h-safe-area-inset-bottom bg-black/90" />
        </nav>
    );
}