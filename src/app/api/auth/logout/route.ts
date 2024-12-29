import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Get the base URL dynamically from the request
    const { headers } = req;
    const host = headers.get('host');
    const protocol = headers.get('x-forwarded-proto') || 'http'; // Default to HTTP if not available

    const loginUrl = `${protocol}://${host}/login`;

    // Clear the cookie by setting it with an empty value and an expired date
    const response = NextResponse.redirect(loginUrl, { status: 302 });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expire immediately
      path: '/', // Apply to the entire site
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
  }
}
