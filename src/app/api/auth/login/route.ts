import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';

// Simulated "database" with dummy data
let users: { email: string; password: string }[] = [
  {
    email: 'user1@example.com',
    password: bcrypt.hashSync('password123', 10), // Pre-hashed password
  },
  {
    email: 'user2@example.com',
    password: bcrypt.hashSync('mypassword', 10), // Pre-hashed password
  },
  {
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin1234', 10), // Pre-hashed password
  },
];

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if the user exists
    const user = users.find((user) => user.email === email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Compare the provided password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    // Return the token
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
