'use client';

import { NotificationProvider } from '@/components/notifications/notification-system';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import '../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <ProtectedRoute>
        <NotificationProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
              {children}
            </main>
          </div>
        </NotificationProvider>
      </ProtectedRoute>
    </div>
  );
}