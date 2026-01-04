'use client'

import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { useAuth } from '@/context/demo-auth-context';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '../lib/utils';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect authenticated users to home
        if (!loading && user) {
            router.push('/home');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh text-center flex items-center justify-center p-4 relative">
            <AnimatedGridPattern
                width={35}
                height={35}
                maxOpacity={0.2}
                className={'[mask-image:linear-gradient(to_top,#fff9,transparent)]'}
            />
            <div className="max-w-5xl z-20 md:-translate-y-6">
                {/* <div className="flex items-center justify-center p-3 mx-auto rounded-md gradient w-fit mb-6">
                    <Music4 className="size-10" />
                </div> */}

                <div className="z-10 flex items-center justify-center mb-8">
                    <AnimatedGradientText>
                        {/* 🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300 " />{' '} */}
                        <span
                            className={cn(`inline animate-gradient gradient bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`)}
                        >
                            {/* Introducing CinePrix */}
                            Your Ultimate Movie Destination!
                        </span>
                    </AnimatedGradientText>
                </div>
                <h1 className="text-3xl md:text-7xl font-bold mb-4">
                    <span className="text-gradient">CinePrix</span>
                </h1>

                <p className="text-muted-foreground max-w-2xl text-base md:text-2xl">
                    Explore the world of cinema like never before! Find the latest blockbusters and all-time favorites in one place.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto mt-20">
                    <Link
                        href={'/auth/signup'}
                        className="text-sm md:text-base gradient inline-block text-white py-2.5 px-10 rounded-full font-semibold hover:brightness-125 hover:scale-105 transition-all"
                    >
                        <UserPlus className="size-5 inline mr-2" /> Get Started Free!
                    </Link>
                    
                    <Link
                        href={'/auth/login'}
                        className="text-sm md:text-base border border-gray-600 inline-block text-white py-2.5 px-10 rounded-full font-semibold hover:bg-gray-800 hover:scale-105 transition-all"
                    >
                        <LogIn className="size-5 inline mr-2" /> Sign In
                    </Link>
                </div>
            </div>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs md:text-sm font-semibold text-muted-foreground w-full text-center">
                Made by{' '}
                <a href="https://github.com/siddhesh940" target="_blank" className="underline">
                    https://github.com/siddhesh940
                </a>
            </p>
        </div>
    );
};

export default LandingPage;
