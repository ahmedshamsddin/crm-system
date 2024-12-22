import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

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
    // Parse and validate request body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the "database"
    const newUser = { email, password: hashedPassword };
    users.push(newUser);

    return NextResponse.json(
      { message: 'User registered successfully', user: { email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'An error occurred while registering the user' },
      { status: 500 }
    );
  }
}
