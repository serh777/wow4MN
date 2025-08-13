'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Logo.module.css';

export function Logo({ size = 'default' }) {
  return (
    <Link href="/" className={styles.logoContainer} style={size === 'small' ? { width: '60px', height: '60px' } : {}}>
      <div className={styles.glow}></div>
      <div className={styles.hexagonGroup}>
        <div className={styles.hexagon1}></div>
        <div className={styles.hexagon2}></div>
        <div className={styles.hexagon3}></div>
      </div>
    </Link>
  );
}

export function LogoWithText() {
  return (
    <Link href="/" className={styles.logoWithText}>
      <div className={styles.logoContainer}>
        <div className={styles.glow}></div>
        <div className={styles.hexagonGroup}>
          <div className={styles.hexagon1}></div>
          <div className={styles.hexagon2}></div>
          <div className={styles.hexagon3}></div>
        </div>
      </div>
      <span className={styles.text}>WowSEOWeb3</span>
    </Link>
  );
}