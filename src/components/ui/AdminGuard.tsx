'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'lifestyle_admin_auth';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem(AUTH_KEY);
      if (!auth) {
        router.replace('/admin/login');
      }
    }
  }, [router]);

  return <>{children}</>;
}
