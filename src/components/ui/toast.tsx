'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'destructive';
    title?: string;
    description?: string;
    action?: React.ReactNode;
  }
>(({ className, variant = 'default', title, description, action, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all',
        variant === 'default' && 'bg-background border-border',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground border-destructive',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {variant === 'destructive' && <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>}
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-center">{action}</div>}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (props.onClick) props.onClick(e as any);
        }}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <Icons.close className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
});
Toast.displayName = 'Toast';

const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm font-medium', className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

const ToastAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex shrink-0 items-center', className)}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

export { Toast, ToastTitle, ToastDescription, ToastAction };