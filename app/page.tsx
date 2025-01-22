import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard/project-browser');
  return null;
}
