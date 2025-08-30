'use client';

import Link from 'next/link';
import { csvUrl } from '../../src/app/lib/api';
import { ParamProps } from '../../src/app/utils/types';
export default function DownloadCsvButton({ params }: ParamProps) {
  const href = csvUrl(params);

  return (
    <Link
      href={href}
      prefetch={false} // ✅ don’t prefetch CSV files (saves bandwidth)
      target="_blank"
      rel="noopener noreferrer"
      download
      className="inline-block px-3 py-2 rounded-xl border shadow bg-white hover:bg-neutral-50 text-sm transition-colors"
    >
      Download CSV
    </Link>
  );
}