import { ProtectedRoute } from '@/components/auth/protected-route';
import { BottomNav } from '@/components/bottom-nav';
import Sidebar from '@/components/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FavoritesProvider } from '@/context/enhanced-favorites-context';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProtectedRoute>
            <FavoritesProvider>
                <div className="min-h-screen bg-black text-white">
                    {/* Background gradient effects */}
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                    </div>
                    
                    <div className="h-dvh overflow-hidden flex flex-col md:flex-row relative">
                        <Sidebar />
                        <main className="flex-1 relative max-md:h-[calc(100dvh-4rem)]">
                            <ScrollArea className="h-full">
                                <div className="max-w-screen-xl mx-auto px-3 py-4 md:px-6 md:py-6 !pb-20 animate-fade-in">
                                    {children}
                                </div>
                            </ScrollArea>
                        </main>
                        <BottomNav />
                    </div>
                </div>
            </FavoritesProvider>
        </ProtectedRoute>
    );
};

export default DashboardLayout;