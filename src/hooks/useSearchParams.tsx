import { useState, useEffect } from 'react';

export function useSearchParams(initialParams: [string, string][] = []) {
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(initialParams));
  }, []);


  return [params, setParams] as const;
}