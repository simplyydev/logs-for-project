'use client';

import { useEffect } from 'react';

export function AutoRefresh({ seconds = 8 }: { seconds?: number }) {
  useEffect(() => {
    const id = setInterval(() => {
      window.location.reload();
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return null;
}
