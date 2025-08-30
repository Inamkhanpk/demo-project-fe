

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RangeKey } from '@/app/utils/types';


export default function FiltersBar({ onChange }: { onChange: (p: URLSearchParams) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [range, setRange] = useState<RangeKey>((searchParams.get('range') as RangeKey) || 'YTD');
  const [from, setFrom] = useState(searchParams.get('from') || '');
  const [to, setTo] = useState(searchParams.get('to') || '');

  useEffect(() => {
    const p = new URLSearchParams();

    p.set('range', range);

    if (range === 'CUSTOM') {
      if (!from || !to) return; // wait until both are selected
      p.set('from', from);
      p.set('to', to);
    }

    // Update URL without full reload
    router.push(`?${p.toString()}`, { scroll: false });

    // Trigger parent handler
    onChange(p);
  }, [range, from, to, router, onChange]);

  return (
    <div className="w-full sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto p-4 flex flex-wrap gap-3 items-center">
        <label className="sr-only">Range</label>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as RangeKey)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="YTD">YTD</option>
          <option value="MTD">MTD</option>
          <option value="WTD">WTD</option>
          <option value="DAILY">DAILY</option>
          <option value="CUSTOM">CUSTOM</option>
        </select>

        {range === 'CUSTOM' && (
          <>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 border rounded-xl"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 border rounded-xl"
            />
          </>
        )}

        <div className="ml-auto text-sm opacity-70">Demo</div>
      </div>
    </div>
  );
}