/**
 * Home Page
 * 
 * Landing page for the Generative UI Platform.
 * Redirects to dashboard for authenticated users.
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard
  // In the future, this could show a landing page for non-authenticated users
  redirect('/dashboard');
}
