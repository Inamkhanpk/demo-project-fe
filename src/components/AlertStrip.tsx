'use client';

import { useEffect, useState, useMemo } from 'react';
import { alertsSSE } from '../../src/app/lib/api';
import {Alert,ParamProps} from '../../src/app/utils/types';

export default function AlertStrip({ params }: ParamProps) {
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const eventSource = alertsSSE(params);
    console.log('EventSource created:', eventSource);
    eventSource.onmessage = (ev) => {
      try {
        const parsed: Alert = JSON.parse(ev.data);
        setAlert(parsed);
      } catch {

        // silently ignore invalid data
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [params]);

  // Precompute CSS classes (avoids recalculation on every render)
  const alertStyle = useMemo(() => {
    if (!alert) return '';
    switch (alert.level) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'info':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  }, [alert]);

  if (!alert) return null;

  return (
    <div
      className={`w-full border ${alertStyle}`}
      role="alert" 
      aria-live="polite"
    >
      <div className="max-w-6xl mx-auto px-4 py-2 text-sm flex gap-2">
        <span className="font-semibold capitalize">{alert.level}:</span>
        <span>{alert.message}</span>
      </div>
    </div>
  );
}