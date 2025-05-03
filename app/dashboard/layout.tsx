// app/dashboard/layout.tsx
import InstgramDashboardNav from '@/app/components/dashboard/InstagramDashboardNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <InstgramDashboardNav />
            <main className="flex-grow p-6">
                {children}
            </main>
        </div>
    );
}