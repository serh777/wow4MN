'use client';

import * as React from 'react';
import { WalletHub } from './components/wallet-hub';
import ErrorBoundary from '@/components/error-boundary';

export default function WalletPage() {
  return (
    <ErrorBoundary>
      <WalletHub />
    </ErrorBoundary>
  );
}