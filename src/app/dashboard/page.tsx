'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {TimeInput} from "@nextui-org/react";
import {parseZonedDateTime} from "@internationalized/date";


type Attendance = {
  day: string;
  startHour: string;
  endHour: string;
};

const DashboardPage = () => {
  
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Retrieve the token from cookies
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: decodedToken.email });

      // Initialize attendance data for the current month
      const days = Array.from({ length: 31 }, (_, i) => {
        const date = new Date();
        date.setDate(i + 1);
        return { day: date.toISOString().slice(0, 10), startHour: '', endHour: '' }; // Ensure fields are initialized with empty strings
      });
      setAttendance(days);
    } catch (error) {
      setError('Invalid or expired token');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAttendanceChange = (index: number, field: 'startHour' | 'endHour', value: string) => {
    setAttendance((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day))
    );
  };

  const handleAttendanceSubmit = async () => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, attendance }),
      });

      if (response.ok) {
        alert('Attendance saved successfully!');
      } else {
        alert('Failed to save attendance.');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };
  const handleCustomTimeChange = (
    index: number,
    field: keyof Attendance,  // Type the field as a key of the Attendance object
    value: string
  ) => {
    const regex = /^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    // Validate if the value matches the HH:mm format or is empty
    if (true) {
      setAttendance((prev) =>
        prev.map((day, i) =>
          i === index ? { ...day, [field]: value } : day
        )
      );
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Welcome to the Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <p className="text-lg mb-4">Hello, {user?.email}!</p>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Attendance Form</h2>
        {/* <div className="overflow-auto max-h-[400px]"> */}
        <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Start Hour</th>
            <th className="border border-gray-300 px-4 py-2">End Hour</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((day, index) => (
            <tr key={day.day}>
              <td className="border border-gray-300 px-4 py-2">{day.day}</td>
              <td className="border border-gray-300 px-4 py-2">
                {/* <input
                  type="text"
                  value={day.startHour}
                  onChange={(e) => handleCustomTimeChange(index, 'startHour', e.target.value)}
                  placeholder="HH:mm"
                  pattern="^([01][0-9]|2[0-3]):([0-5][0-9])$"
                  className="w-full p-2 border rounded"
                  title="Time must be in HH:mm format (24-hour clock)"
                /> */}
                <TimeInput
      defaultValue={parseZonedDateTime("2022-11-07T00:00[America/Los_Angeles]")}
      granularity="minute"
      hourCycle={24}
      label="IN"
    />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {/* <input
                  type="text"
                  value={day.endHour}
                  onChange={(e) => handleCustomTimeChange(index, 'endHour', e.target.value)}
                  placeholder="HH:mm"
                  pattern="^([01][0-9]|2[0-3]):([0-5][0-9])$"
                  className="w-full p-2 border rounded"
                  title="Time must be in HH:mm format (24-hour clock)"
                /> */}
                <TimeInput
      defaultValue={parseZonedDateTime("2022-11-07T00:00[America/Los_Angeles]")}
      granularity="minute"
      hourCycle={24}
      label="OUT"
    />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        {/* </div> */}
        <button
          onClick={handleAttendanceSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
