'use client';

import React, { useMemo} from 'react';
import {  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import type { MetricPoint, MetricsResponse, CustomTooltipProps } from '../../src/app/utils/types';
import { formatCurrency } from '@/app/utils/date';


const CustomTooltip = React.memo(function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload as MetricPoint & { ly?: MetricPoint };

  const thisYear = { revenue: p.revenue, expenses: p.expenses, profit: p.profit };
  const ly = p.ly;
  const pct = ly
    ? ((thisYear.profit - ly.profit) / (ly.profit || 1)) * 100
    : undefined;

  return (
    <div className="bg-white border rounded-xl p-3 shadow max-w-xs text-sm">
      <div className="font-semibold">{label}</div>
      <div className="mt-1">
        This period — Rev {formatCurrency(thisYear.revenue)}, Exp {formatCurrency(thisYear.expenses)}, Profit{" "}
        <span className="font-semibold">{formatCurrency(thisYear.profit)}</span>
      </div>
      {ly && (
        <div className="text-xs mt-1 opacity-80">
          LY same period — Profit {formatCurrency(ly.profit)}{" "}
          {pct !== undefined && <span>({pct.toFixed(1)}%)</span>}
        </div>
      )}
    </div>
  );
});

// --- Main component ---
export default function LineChartPanel({ data }: { data: MetricsResponse }) {
 

  // Memoized augmentation (last year data)
  const augmented = useMemo(() => {
    return data.points.map((p) => {
      const date = new Date(p.date);
      const lyDate = new Date(date);
      lyDate.setFullYear(date.getFullYear() - 1);
      const ly = { ...p, date: lyDate.toISOString().slice(0, 10) };
      return { ...p, ly };
    });
  }, [data.points]);

  return (
    <div className="w-full h-[420px] bg-white rounded-2xl shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={augmented} margin={{ left: 12, right: 24, top: 12, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => v / 1000 + 'k'} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#1f77b4" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="expenses" stroke="#d62728" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="profit" stroke="#2ca02c" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}