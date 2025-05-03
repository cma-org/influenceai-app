// app/page.tsx

import { redirect } from 'next/navigation';
import { getServerAuthToken } from '@/app/lib/utils/server-cookies';

export default function Home() {
  // Server-side redirect
  const token = getServerAuthToken();

  if (token) {
    redirect('/dashboard');
  } else {
    redirect('/user-type-selection');
  }

  // This will never be rendered due to the redirects above
  return null;
}