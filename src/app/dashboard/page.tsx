// 'use client';
// import { useEffect, useState, useCallback } from 'react';
// import FiltersBar from '@/components/FiltersBar';
// import LineChartPanel from '@/components/LineChartPanel';
// import AlertStrip from '@/components/AlertStrip';
// import DownloadCsvButton from '@/components/DownloadCsvButton';
// import { fetchMetrics } from '../lib/api';
// import type { MetricsResponse } from '../utils/types';

// export default function Page() {
//   const [params, setParams] = useState(() => new URLSearchParams([['range', 'YTD']]));
//   const [data, setData] = useState<MetricsResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const result = await fetchMetrics(params);
//       setData(result);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : String(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [params]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return (
    
//     <div className="min-h-screen">
//       <FiltersBar onChange={setParams} />
//       {data && <AlertStrip params={params} />}

//       <main className="max-w-6xl mx-auto p-4 space-y-4">
//         <header className="flex justify-between items-center">
//           <h1 className="text-2xl font-semibold">Business Performance Dashboard</h1>
//           <DownloadCsvButton params={params} />
//         </header>

//         {loading && <div className="animate-pulse h-[420px] bg-neutral-200 rounded-2xl" />}
//          {loading && <div className="animate-pulse h-[420px] bg-neutral-200 rounded-2xl" />}

//         {!loading && error && (
//           <div className="bg-red-50 border rounded p-4 text-red-700">{error}</div>
//         )}

//         {!loading && data && (
//           <>
//             <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               {([
//                 { label: 'Revenue', value: data.summary.periodRevenue },
//                 { label: 'Expenses', value: data.summary.periodExpenses },
//                 { label: 'Profit', value: data.summary.periodProfit },
//               ] as const).map(({ label, value }) => (
//                 <div key={label} className="bg-white rounded-2xl p-4 shadow">
//                   <div className="text-sm opacity-60">{label}</div>
//                   <div className="text-2xl font-semibold">${value.toLocaleString()}</div>
//                 </div>
//               ))}
//             </section>

//             <LineChartPanel data={data} />
//           </>
//         )}
//       </main>
//     </div>
    
//   );
// }


'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import FiltersBar from '@/components/FiltersBar'
import LineChartPanel from '@/components/LineChartPanel'
import AlertStrip from '@/components/AlertStrip'
import DownloadCsvButton from '@/components/DownloadCsvButton'
import { fetchMetrics } from '../lib/api'
import type { MetricsResponse } from '../utils/types'

// Force runtime rendering to avoid build-time prerender errors
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read range from URL, default to 'YTD'
  const range = searchParams.get('range') || 'YTD'

  const [data, setData] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch metrics based on current URL params
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const result = await fetchMetrics(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Update URL when filters change
  const handleFiltersChange = (newParams: URLSearchParams) => {
    router.push(`/dashboard?${newParams.toString()}`)
  }

  return (
    <div className="min-h-screen">
      <FiltersBar
        onChange={handleFiltersChange}
        //initialParams={searchParams}
      />

      {data && <AlertStrip params={searchParams} />}

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Business Performance Dashboard</h1>
          <DownloadCsvButton params={searchParams} />
        </header>

        {loading && (
          <div className="animate-pulse h-[420px] bg-neutral-200 rounded-2xl" />
        )}

        {!loading && error && (
          <div className="bg-red-50 border rounded p-4 text-red-700">{error}</div>
        )}

        {!loading && data && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([
                { label: 'Revenue', value: data.summary.periodRevenue },
                { label: 'Expenses', value: data.summary.periodExpenses },
                { label: 'Profit', value: data.summary.periodProfit },
              ] as const).map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl p-4 shadow">
                  <div className="text-sm opacity-60">{label}</div>
                  <div className="text-2xl font-semibold">${value.toLocaleString()}</div>
                </div>
              ))}
            </section>

            <LineChartPanel data={data} />
          </>
        )}
      </main>
    </div>
  )
}