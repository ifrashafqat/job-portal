import { redirect } from 'next/navigation';

// This page will only exist in the admin deployment
export default function AdminRedirectPage() {
  redirect('/admin');
}