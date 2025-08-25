'use client';

import React, { useState, useEffect } from 'react';
import { NotificationProvider } from '@/components/notifications/notification-system';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import '../globals.css';
import '@/styles/dashboard.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sincronizar con localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('dashboard_sidebar_collapsed');
    if (savedState) {
      setSidebarCollapsed(JSON.parse(savedState));
    }

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboard_sidebar_collapsed' && e.newValue) {
        setSidebarCollapsed(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={`${inter.className} dashboard-page`}>
      <ProtectedRoute>
        <NotificationProvider>
          <div className="dashboard-layout">
            <Sidebar />
            <main className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed-layout' : ''}`}>
              {children}
            </main>
          </div>
        </NotificationProvider>
      </ProtectedRoute>
    </div>
  );
}