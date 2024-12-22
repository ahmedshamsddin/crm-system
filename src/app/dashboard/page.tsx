'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // You can install this via `npm install js-cookie`

const DashboardPage = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the token from cookies
    const token = Cookies.get('token'); // Get the token from the cookie

    if (!token) {
      router.push('/login'); // Redirect to login page if no token is found
      return;
    }

    // Decode the JWT token to get the user's email (using jwt-decode or similar)
    try {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1])); // Decoding JWT token (simplified)
      setUser({ email: decodedToken.email });
    } catch (error) {
      setError('Invalid or expired token');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold mb-4">Welcome to the Dashboard</h1>
      <p className="text-lg">Hello, {user?.email}!</p>
      <div className="mt-8">
        <p>Here you can manage your account, view reports, and more.</p>
        {/* Add more dashboard functionality here */}
      </div>
    </div>
  );
};

export default DashboardPage;
